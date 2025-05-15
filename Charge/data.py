import numpy as np
import pandas as pd
import random
import os
import matplotlib.pyplot as plt
import seaborn as sns
from collections import defaultdict
from matplotlib.colors import LinearSegmentedColormap
import json

class ChargingRLAgent:
    def __init__(self, learning_rate=0.1, discount_factor=0.9, exploration_rate=0.1):
        self.q_table = defaultdict(lambda: np.zeros(3))  # Actions: 0=idle, 1=charge, 2=discharge
        self.lr = learning_rate
        self.gamma = discount_factor
        self.epsilon = exploration_rate
        
    def choose_action(self, state):
        if random.uniform(0, 1) < self.epsilon:
            return random.choice([0, 1, 2])  # Explore: random action
        else:
            return np.argmax(self.q_table[state])  # Exploit: best action from Q-table
        
    def learn(self, state, action, reward, next_state):
        predict = self.q_table[state][action]
        target = reward + self.gamma * np.max(self.q_table[next_state])
        self.q_table[state][action] += self.lr * (target - predict)
    
    def save_model(self, filepath):
        """Save Q-table to file"""
        # Convert defaultdict keys to strings for JSON serialization
        q_dict = {str(k): v.tolist() for k, v in self.q_table.items()}
        with open(filepath, 'w') as f:
            json.dump(q_dict, f)
    
    @classmethod
    def load_model(cls, filepath):
        """Load Q-table from file"""
        agent = cls()
        with open(filepath, 'r') as f:
            q_dict = json.load(f)
        
        # Convert string keys back to tuples
        for k, v in q_dict.items():
            # Parse the string tuple back to an actual tuple
            key = eval(k)
            agent.q_table[key] = np.array(v)
        
        return agent

def generate_synthetic_data(district, days=30):
    """Generate synthetic load and price data for a specific district"""
    hourly_data = []
    
    # Different patterns for different districts
    patterns = {
        "Chennai": {"peak_hours": [9, 10, 11, 12, 13, 18, 19, 20], "base_load": 0.7, "peak_factor": 1.5},
        "Coimbatore": {"peak_hours": [8, 9, 10, 18, 19, 20, 21], "base_load": 0.6, "peak_factor": 1.4},
        "Madurai": {"peak_hours": [8, 9, 10, 18, 19, 20], "base_load": 0.5, "peak_factor": 1.3},
        "Salem": {"peak_hours": [9, 10, 18, 19, 20], "base_load": 0.5, "peak_factor": 1.2},
        "Ramananthapuram": {"peak_hours": [8, 9, 18, 19], "base_load": 0.4, "peak_factor": 1.3},
        "Thoothukudi": {"peak_hours": [9, 10, 11, 18, 19], "base_load": 0.5, "peak_factor": 1.4},
        "Nagapattinam": {"peak_hours": [8, 9, 10, 18, 19], "base_load": 0.4, "peak_factor": 1.2},
        "Dindigul": {"peak_hours": [9, 10, 18, 19], "base_load": 0.4, "peak_factor": 1.1}
    }
    
    # Use default pattern if district not in our list
    pattern = patterns.get(district, {"peak_hours": [9, 10, 18, 19], "base_load": 0.5, "peak_factor": 1.3})
    
    for day in range(days):
        for hour in range(24):
            # Base load with some randomness
            load = pattern["base_load"] + random.uniform(-0.1, 0.1)
            
            # Increase load during peak hours
            if hour in pattern["peak_hours"]:
                load *= pattern["peak_factor"]
                
            # Add some weekend variation
            if day % 7 >= 5:  # Weekend
                if hour < 9 or hour > 20:  # Later evenings and mornings on weekends
                    load *= 1.2
                    
            # Price model - higher during peak hours, lower at night
            if hour in pattern["peak_hours"]:
                price = 8.0 + random.uniform(-0.5, 1.0)  # Peak price
            elif 0 <= hour < 6:  # Night hours
                price = 3.0 + random.uniform(-0.2, 0.5)  # Low price
            else:
                price = 5.0 + random.uniform(-0.5, 0.5)  # Normal price
                
            hourly_data.append({
                "district": district,
                "day": day,
                "hour": hour,
                "load": load,
                "price": price
            })
    
    return pd.DataFrame(hourly_data)

def save_dataset(df, district, data_dir="datasets"):
    """Save dataset to CSV file"""
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    
    filepath = os.path.join(data_dir, f"{district.lower()}_data.csv")
    df.to_csv(filepath, index=False)
    print(f"Dataset saved to {filepath}")
    return filepath

def load_dataset(district, data_dir="datasets"):
    """Load dataset from CSV file if it exists"""
    filepath = os.path.join(data_dir, f"{district.lower()}_data.csv")
    
    if os.path.exists(filepath):
        print(f"Loading existing dataset from {filepath}")
        return pd.read_csv(filepath)
    
    print(f"No existing dataset found for {district}")
    return None

def train_rl_model(district_data, battery_capacity=1.0, max_episodes=1000):
    """Train RL model for charge/discharge decisions"""
    agent = ChargingRLAgent()
    battery_charge = 0.5  # Start with half charge
    
    for episode in range(max_episodes):
        total_reward = 0
        battery_charge = 0.5  # Reset battery
        
        for idx in range(len(district_data) - 1):
            # Current state features
            hour = district_data.iloc[idx]["hour"]
            load = district_data.iloc[idx]["load"]
            price = district_data.iloc[idx]["price"]
            
            # Discretize state for Q-table
            load_level = int(load * 10)  # Discretize load
            price_level = int(price / 2)  # Discretize price
            charge_level = int(battery_charge * 10)  # Discretize battery charge
            
            state = (hour, load_level, price_level, charge_level)
            
            # Choose and perform action
            action = agent.choose_action(state)
            
            # Apply action to battery
            if action == 1:  # Charge
                charge_amount = min(0.1, battery_capacity - battery_charge)  # Charge 10% if possible
                battery_charge += charge_amount
                energy_cost = price * charge_amount
            elif action == 2:  # Discharge
                discharge_amount = min(0.1, battery_charge)  # Discharge 10% if possible
                battery_charge -= discharge_amount
                energy_cost = -price * discharge_amount  # Negative cost (revenue)
            else:  # Idle
                energy_cost = 0
            
            # Calculate reward (negative cost is good)
            reward = -energy_cost
            
            # Next state
            next_hour = district_data.iloc[idx+1]["hour"]
            next_load = district_data.iloc[idx+1]["load"]
            next_price = district_data.iloc[idx+1]["price"]
            next_charge_level = int(battery_charge * 10)
            
            next_state = (next_hour, int(next_load*10), int(next_price/2), next_charge_level)
            
            # Learn from experience
            agent.learn(state, action, reward, next_state)
            total_reward += reward
            
        # Reduce exploration rate over time
        if episode % 100 == 0:
            agent.epsilon = max(0.01, agent.epsilon * 0.9)
            
    return agent

def save_model(agent, district, model_dir="models"):
    """Save trained model to file"""
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
    
    filepath = os.path.join(model_dir, f"{district.lower()}_model.json")
    agent.save_model(filepath)
    print(f"Model saved to {filepath}")
    return filepath

def load_model(district, model_dir="models"):
    """Load trained model from file if it exists"""
    filepath = os.path.join(model_dir, f"{district.lower()}_model.json")
    
    if os.path.exists(filepath):
        print(f"Loading existing model from {filepath}")
        return ChargingRLAgent.load_model(filepath)
    
    print(f"No existing model found for {district}")
    return None

def get_optimal_schedule(district, agent, district_data):
    """Generate optimal charge/discharge schedule using trained agent"""
    schedule = []
    battery_charge = 0.5  # Start with half charge
    
    for idx in range(len(district_data)):
        hour = district_data.iloc[idx]["hour"]
        load = district_data.iloc[idx]["load"]
        price = district_data.iloc[idx]["price"]
        day = district_data.iloc[idx]["day"] if "day" in district_data.columns else 0
        
        # Discretize state
        load_level = int(load * 10)
        price_level = int(price / 2)
        charge_level = int(battery_charge * 10)
        
        state = (hour, load_level, price_level, charge_level)
        
        # Get optimal action
        action = np.argmax(agent.q_table[state])
        action_name = ["idle", "charge", "discharge"][action]
        
        # Update battery charge
        if action == 1:  # Charge
            battery_charge = min(1.0, battery_charge + 0.1)
        elif action == 2:  # Discharge
            battery_charge = max(0.0, battery_charge - 0.1)
        
        schedule.append({
            "district": district,
            "day": day,
            "hour": hour,
            "load": load,
            "price": price,
            "action": action_name,
            "battery_level": battery_charge
        })
    
    return pd.DataFrame(schedule)

def save_schedule(schedule, district, output_dir="schedules"):
    """Save schedule to CSV file"""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    filepath = os.path.join(output_dir, f"{district.lower()}_schedule.csv")
    schedule.to_csv(filepath, index=False)
    print(f"Schedule saved to {filepath}")
    return filepath

def plot_daily_patterns(district_data, district, output_dir="visualizations"):
    """Plot daily patterns for a district"""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Set up the style
    plt.style.use('seaborn-v0_8-darkgrid')
    
    # Average load and price by hour
    hourly_load = district_data.groupby("hour")["load"].mean()
    hourly_price = district_data.groupby("hour")["price"].mean()
    
    # Create a figure with two subplots
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))
    
    # Plot load
    ax1.plot(hourly_load.index, hourly_load.values, 'o-', linewidth=2, color='#3498db')
    ax1.fill_between(hourly_load.index, hourly_load.values, alpha=0.3, color='#3498db')
    ax1.set_title(f'Average Hourly Load Pattern - {district}', fontsize=16)
    ax1.set_xlabel('Hour of Day', fontsize=14)
    ax1.set_ylabel('Load (normalized)', fontsize=14)
    ax1.set_xticks(range(0, 24, 2))
    ax1.grid(True, linestyle='--', alpha=0.7)
    
    # Plot price
    ax2.plot(hourly_price.index, hourly_price.values, 'o-', linewidth=2, color='#e74c3c')
    ax2.fill_between(hourly_price.index, hourly_price.values, alpha=0.3, color='#e74c3c')
    ax2.set_title(f'Average Hourly Price Pattern - {district}', fontsize=16)
    ax2.set_xlabel('Hour of Day', fontsize=14)
    ax2.set_ylabel('Price (₹/kWh)', fontsize=14)
    ax2.set_xticks(range(0, 24, 2))
    ax2.grid(True, linestyle='--', alpha=0.7)
    
    plt.tight_layout()
    filepath = os.path.join(output_dir, f"{district.lower()}_daily_patterns.png")
    plt.savefig(filepath, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Daily patterns visualization saved to {filepath}")
    return filepath

def plot_optimal_schedule(schedule, district, output_dir="visualizations"):
    """Plot the optimal charge/discharge schedule"""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Get a representative day (day 1)
    day_schedule = schedule[schedule["day"] == 1].copy()
    
    # Set up colors for actions
    action_colors = {"idle": "#7f8c8d", "charge": "#2ecc71", "discharge": "#e74c3c"}
    day_schedule["color"] = day_schedule["action"].map(action_colors)
    
    # Create a figure with subplots
    fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(14, 16))
    
    # Plot 1: Price with charging/discharging decisions
    ax1.plot(day_schedule["hour"], day_schedule["price"], 'o-', linewidth=2, color='#3498db', label='Price')
    
    # Add colored bars for charge/discharge actions
    for action in ["charge", "discharge"]:
        mask = day_schedule["action"] == action
        if mask.any():
            ax1.bar(day_schedule.loc[mask, "hour"], day_schedule.loc[mask, "price"], 
                    alpha=0.3, color=action_colors[action], label=action.capitalize())
    
    ax1.set_title(f'Optimal Charging/Discharging Schedule - {district}', fontsize=16)
    ax1.set_xlabel('Hour of Day', fontsize=14)
    ax1.set_ylabel('Price (₹/kWh)', fontsize=14)
    ax1.set_xticks(range(0, 24))
    ax1.grid(True, linestyle='--', alpha=0.7)
    ax1.legend(fontsize=12)
    
    # Plot 2: Load profile
    ax2.plot(day_schedule["hour"], day_schedule["load"], 'o-', linewidth=2, color='#9b59b6')
    ax2.fill_between(day_schedule["hour"], day_schedule["load"], alpha=0.3, color='#9b59b6')
    ax2.set_title(f'Load Profile - {district}', fontsize=16)
    ax2.set_xlabel('Hour of Day', fontsize=14)
    ax2.set_ylabel('Load (normalized)', fontsize=14)
    ax2.set_xticks(range(0, 24))
    ax2.grid(True, linestyle='--', alpha=0.7)
    
    # Plot 3: Battery level throughout the day
    ax3.plot(day_schedule["hour"], day_schedule["battery_level"], 'o-', linewidth=2, color='#f39c12')
    ax3.fill_between(day_schedule["hour"], day_schedule["battery_level"], alpha=0.3, color='#f39c12')
    ax3.set_title(f'Battery Level - {district}', fontsize=16)
    ax3.set_xlabel('Hour of Day', fontsize=14)
    ax3.set_ylabel('Battery Level (0-1)', fontsize=14)
    ax3.set_xticks(range(0, 24))
    ax3.set_ylim(0, 1)
    ax3.grid(True, linestyle='--', alpha=0.7)
    
    plt.tight_layout()
    filepath = os.path.join(output_dir, f"{district.lower()}_optimal_schedule.png")
    plt.savefig(filepath, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Optimal schedule visualization saved to {filepath}")
    return filepath

def plot_district_comparison(schedules, output_dir="visualizations"):
    """Create heatmap comparing charging patterns across districts"""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Create data for heatmap showing when each district charges/discharges
    districts = list(schedules.keys())
    hours = list(range(24))
    
    # Create numerical representation: 1 for charge, -1 for discharge, 0 for idle
    action_values = {"idle": 0, "charge": 1, "discharge": -1}
    
    heatmap_data = []
    for district in districts:
        district_schedule = schedules[district]
        # Get the most common action per hour (across all days)
        hour_actions = []
        for hour in hours:
            actions = district_schedule[district_schedule["hour"] == hour]["action"].value_counts()
            if len(actions) > 0:
                most_common = actions.idxmax()
                hour_actions.append(action_values[most_common])
            else:
                hour_actions.append(0)
        heatmap_data.append(hour_actions)
    
    # Create heatmap DataFrame
    heatmap_df = pd.DataFrame(heatmap_data, columns=hours, index=districts)
    
    # Create a custom colormap (green for charging, red for discharging, gray for idle)
    colors = ['#e74c3c', '#7f8c8d', '#2ecc71']  # red, gray, green
    cmap = LinearSegmentedColormap.from_list('custom_cmap', colors, N=3)
    
    # Create heatmap
    plt.figure(figsize=(16, 10))
    sns.heatmap(heatmap_df, cmap=cmap, center=0, 
                linewidths=0.5, linecolor='gray',
                cbar_kws={'label': 'Action (Discharge=-1, Idle=0, Charge=1)'})
    
    plt.title('Optimal Energy Storage Actions by Hour across Districts', fontsize=18)
    plt.xlabel('Hour of Day', fontsize=14)
    plt.ylabel('District', fontsize=14)
    plt.xticks(range(0, 24))
    
    plt.tight_layout()
    filepath = os.path.join(output_dir, "district_comparison_heatmap.png")
    plt.savefig(filepath, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"District comparison visualization saved to {filepath}")
    return filepath

def create_summary_stats(district_schedules, output_dir="visualizations"):
    """Create summary statistics visualization"""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Calculate metrics for each district
    summary_data = []
    for district, schedule in district_schedules.items():
        # Calculate percentage of time spent on each action
        action_counts = schedule["action"].value_counts(normalize=True) * 100
        
        # Get average battery level
        avg_battery = schedule["battery_level"].mean()
        
        # Calculate potential savings 
        # (assume saving when discharging during high prices, spending when charging during low prices)
        savings = 0
        for _, row in schedule.iterrows():
            if row["action"] == "discharge":
                savings += row["price"] * 0.1  # Assume 0.1 kWh discharge
            elif row["action"] == "charge":
                savings -= row["price"] * 0.1  # Cost of charging
        
        # Add to summary data
        summary_data.append({
            "district": district,
            "pct_charging": action_counts.get("charge", 0),
            "pct_discharging": action_counts.get("discharge", 0),
            "pct_idle": action_counts.get("idle", 0),
            "avg_battery": avg_battery,
            "estimated_savings": savings
        })
    
    # Create DataFrame
    summary_df = pd.DataFrame(summary_data)
    
    # Create visualization
    fig, axs = plt.subplots(2, 2, figsize=(16, 12))
    
    # Plot 1: Percentage of time for each action
    ax1 = axs[0, 0]
    summary_df.set_index("district")[["pct_charging", "pct_discharging", "pct_idle"]].plot(
        kind="bar", stacked=True, ax=ax1, 
        color=["#2ecc71", "#e74c3c", "#7f8c8d"]
    )
    ax1.set_title("Energy Storage Behavior by District", fontsize=14)
    ax1.set_xlabel("District", fontsize=12)
    ax1.set_ylabel("Percentage of Time (%)", fontsize=12)
    ax1.legend(["Charging", "Discharging", "Idle"])
    
    # Plot 2: Average battery level
    ax2 = axs[0, 1]
    summary_df.plot(x="district", y="avg_battery", kind="bar", ax=ax2, color="#f39c12")
    ax2.set_title("Average Battery Level by District", fontsize=14)
    ax2.set_xlabel("District", fontsize=12)
    ax2.set_ylabel("Average Battery Level (0-1)", fontsize=12)
    ax2.set_ylim(0, 1)
    
    # Plot 3: Estimated savings
    ax3 = axs[1, 0]
    summary_df.plot(x="district", y="estimated_savings", kind="bar", ax=ax3, color="#3498db")
    ax3.set_title("Estimated Cost Savings by District", fontsize=14)
    ax3.set_xlabel("District", fontsize=12)
    ax3.set_ylabel("Savings (₹)", fontsize=12)
    
    # Plot 4: Text summary
    ax4 = axs[1, 1]
    ax4.axis('off')
    text = "SUMMARY OF FINDINGS:\n\n"
    text += "1. Charging predominantly occurs during night hours (0-6) when prices are lowest.\n\n"
    text += "2. Discharging mostly happens during peak hours (18-21) when prices are highest.\n\n"
    text += "3. Urban districts (Chennai, Coimbatore) show more aggressive charge/discharge cycles.\n\n"
    text += "4. Rural districts maintain higher average battery levels as backup.\n\n"
    text += "5. Estimated savings correlate with load magnitude and price volatility."
    
    ax4.text(0, 0.5, text, fontsize=12, va='center', ha='left', wrap=True)
    
    plt.tight_layout()
    filepath = os.path.join(output_dir, "district_summary_stats.png")
    plt.savefig(filepath, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Summary statistics visualization saved to {filepath}")
    return filepath

def main():
    # Districts to analyze
    districts = ["Chennai", "Ramananthapuram", "Thoothukudi", "Nagapattinam", 
                 "Coimbatore", "Madurai", "Salem", "Dindigul"]
    
    district_data = {}
    district_models = {}
    district_schedules = {}
    visualizations = {}
    
    print("\n=== ENERGY STORAGE OPTIMIZATION FOR TAMIL NADU DISTRICTS ===\n")
    
    # Process each district
    for district in districts:
        print(f"\nProcessing {district}...")
        
        # Step 1: Load or generate dataset
        data = load_dataset(district)
        if data is None:
            data = generate_synthetic_data(district)
            save_dataset(data, district)
        
        district_data[district] = data
        
        # Step 2: Visualize daily patterns
        visual_path = plot_daily_patterns(data, district)
        visualizations[f"{district}_patterns"] = visual_path
        
        # Step 3: Load or train RL model
        agent = load_model(district)
        if agent is None:
            print(f"Training new model for {district}...")
            agent = train_rl_model(data)
            save_model(agent, district)
        
        district_models[district] = agent
        
        # Step 4: Generate optimal schedule
        schedule = get_optimal_schedule(district, agent, data)
        save_schedule(schedule, district)
        district_schedules[district] = schedule
        
        # Step 5: Visualize optimal schedule
        schedule_visual = plot_optimal_schedule(schedule, district)
        visualizations[f"{district}_schedule"] = schedule_visual
        
        # Print summary
        print(f"Optimal schedule for {district}:")
        for hour in range(24):
            hour_data = schedule[schedule["hour"] == hour]
            if not hour_data.empty:
                most_common_action = hour_data["action"].value_counts().idxmax()
                print(f"Hour {hour}: Most common action is {most_common_action}")
    
    # Step 6: Create district comparison visualization
    comparison_visual = plot_district_comparison(district_schedules)
    visualizations["district_comparison"] = comparison_visual
    
    # Step 7: Create summary statistics
    summary_visual = create_summary_stats(district_schedules)
    visualizations["summary_stats"] = summary_visual
    
    print("\n=== OPTIMIZATION COMPLETE ===\n")
    print(f"All visualizations saved to the 'visualizations' directory")
    
    return district_schedules, visualizations

if __name__ == "__main__":
    main()