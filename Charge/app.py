import streamlit as st
import numpy as np
import pandas as pd
import random
import os
import matplotlib.pyplot as plt
import seaborn as sns
from collections import defaultdict
from matplotlib.colors import LinearSegmentedColormap
import json
import time
import base64
from io import BytesIO

# App title and description
st.set_page_config(page_title="Energy Storage Optimization - Tamil Nadu", layout="wide")

st.title("⚡ Energy Storage Optimization for Tamil Nadu Districts")
st.markdown("""
This application uses Reinforcement Learning to determine optimal charging and discharging patterns for energy storage systems in different districts of Tamil Nadu.
By analyzing consumption patterns, price variations, and grid conditions, we optimize when to charge (store energy) and when to discharge (use stored energy).
""")

# Sidebar
st.sidebar.title("Settings")
chosen_district = st.sidebar.selectbox(
    "Select District",
    ["Chennai", "Coimbatore", "Madurai", "Salem", "Ramananthapuram", "Thoothukudi", "Nagapattinam", "Dindigul"],
    index=0
)

model_params = st.sidebar.expander("Model Parameters", expanded=False)
learning_rate = model_params.slider("Learning Rate", 0.01, 0.5, 0.1, 0.01)
discount_factor = model_params.slider("Discount Factor", 0.5, 0.99, 0.9, 0.01)
exploration_rate = model_params.slider("Initial Exploration Rate", 0.01, 0.5, 0.1, 0.01)
training_episodes = model_params.slider("Training Episodes", 100, 5000, 1000, 100)

data_params = st.sidebar.expander("Data Parameters", expanded=False)
days_to_generate = data_params.slider("Days to Generate", 7, 60, 30, 1)
force_regenerate = data_params.checkbox("Force Regenerate Data", value=False)
force_retrain = data_params.checkbox("Force Retrain Model", value=False)

st.sidebar.markdown("---")
st.sidebar.markdown("### About")
st.sidebar.info(
    "This application was developed for a hackathon prototype. "
    "It demonstrates how AI can optimize energy storage systems based on local usage patterns."
)

# Create directories
for directory in ["datasets", "models", "visualizations", "schedules"]:
    os.makedirs(directory, exist_ok=True)

# Helper function to convert plot to image for Streamlit
def plot_to_image():
    buf = BytesIO()
    plt.savefig(buf, format="png", dpi=300, bbox_inches='tight')
    plt.close()
    return buf

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
    def load_model(cls, filepath, learning_rate=0.1, discount_factor=0.9, exploration_rate=0.1):
        """Load Q-table from file"""
        agent = cls(learning_rate, discount_factor, exploration_rate)
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
    return filepath

def load_dataset(district, data_dir="datasets"):
    """Load dataset from CSV file if it exists"""
    filepath = os.path.join(data_dir, f"{district.lower()}_data.csv")
    
    if os.path.exists(filepath):
        return pd.read_csv(filepath)
    
    return None

def train_rl_model(district_data, battery_capacity=1.0, max_episodes=1000, learning_rate=0.1, discount_factor=0.9, exploration_rate=0.1):
    """Train RL model for charge/discharge decisions"""
    agent = ChargingRLAgent(learning_rate, discount_factor, exploration_rate)
    battery_charge = 0.5  # Start with half charge
    
    # Create a progress bar
    progress_text = "Training model..."
    my_bar = st.progress(0, text=progress_text)
    
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
        
        # Update progress bar
        my_bar.progress((episode + 1) / max_episodes, text=f"Training model... Episode {episode+1}/{max_episodes}")
            
    return agent

def save_model(agent, district, model_dir="models"):
    """Save trained model to file"""
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
    
    filepath = os.path.join(model_dir, f"{district.lower()}_model.json")
    agent.save_model(filepath)
    return filepath

def load_model(district, model_dir="models", learning_rate=0.1, discount_factor=0.9, exploration_rate=0.1):
    """Load trained model from file if it exists"""
    filepath = os.path.join(model_dir, f"{district.lower()}_model.json")
    
    if os.path.exists(filepath):
        return ChargingRLAgent.load_model(filepath, learning_rate, discount_factor, exploration_rate)
    
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
    return filepath

def plot_daily_patterns(district_data, district):
    """Plot daily patterns for a district"""
    # Set up the style
    plt.style.use('seaborn-v0_8-darkgrid')
    
    # Average load and price by hour
    hourly_load = district_data.groupby("hour")["load"].mean()
    hourly_price = district_data.groupby("hour")["price"].mean()
    
    # Create a figure with two subplots
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
    
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
    return plot_to_image()

def plot_optimal_schedule(schedule, district):
    """Plot the optimal charge/discharge schedule"""
    # Get a representative day (day 1)
    day_schedule = schedule[schedule["day"] == 1].copy()
    
    # Set up colors for actions
    action_colors = {"idle": "#7f8c8d", "charge": "#2ecc71", "discharge": "#e74c3c"}
    day_schedule["color"] = day_schedule["action"].map(action_colors)
    
    # Create a figure with subplots
    fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(10, 12))
    
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
    return plot_to_image()

def plot_district_comparison(district_schedules):
    """Create heatmap comparing charging patterns across districts"""
    # Create data for heatmap showing when each district charges/discharges
    districts = list(district_schedules.keys())
    hours = list(range(24))
    
    # Create numerical representation: 1 for charge, -1 for discharge, 0 for idle
    action_values = {"idle": 0, "charge": 1, "discharge": -1}
    
    heatmap_data = []
    for district in districts:
        district_schedule = district_schedules[district]
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
    plt.figure(figsize=(14, 8))
    sns.heatmap(heatmap_df, cmap=cmap, center=0, 
                linewidths=0.5, linecolor='gray',
                cbar_kws={'label': 'Action (Discharge=-1, Idle=0, Charge=1)'})
    
    plt.title('Optimal Energy Storage Actions by Hour across Districts', fontsize=18)
    plt.xlabel('Hour of Day', fontsize=14)
    plt.ylabel('District', fontsize=14)
    plt.xticks(range(0, 24))
    
    plt.tight_layout()
    return plot_to_image()

def plot_action_sankey(schedule):
    """Plot a Sankey diagram showing energy flow"""
    from matplotlib.sankey import Sankey
    
    # Calculate total energy charged and discharged by hour
    energy_flow = []
    
    for hour in range(24):
        hour_data = schedule[schedule["hour"] == hour]
        charge_count = sum(1 for a in hour_data["action"] if a == "charge")
        discharge_count = sum(1 for a in hour_data["action"] if a == "discharge")
        
        # Scale for better visibility
        energy_flow.append({
            "hour": hour,
            "charge": charge_count / len(hour_data) if len(hour_data) > 0 else 0,
            "discharge": -discharge_count / len(hour_data) if len(hour_data) > 0 else 0
        })
    
    # Create Sankey diagram
    fig = plt.figure(figsize=(12, 8))
    ax = fig.add_subplot(1, 1, 1, xticks=[], yticks=[])
    sankey = Sankey(ax=ax, scale=0.01, offset=0.2, head_angle=120, margin=0.4)
    
    # Add flows for charges (morning/night to battery)
    night_charge = sum(flow["charge"] for flow in energy_flow if flow["hour"] < 6)
    mid_charge = sum(flow["charge"] for flow in energy_flow if 6 <= flow["hour"] < 16)
    evening_charge = sum(flow["charge"] for flow in energy_flow if flow["hour"] >= 16)
    
    # Add flows for discharges (battery to peak periods)
    morning_discharge = abs(sum(flow["discharge"] for flow in energy_flow if 6 <= flow["hour"] < 12))
    afternoon_discharge = abs(sum(flow["discharge"] for flow in energy_flow if 12 <= flow["hour"] < 18))
    evening_discharge = abs(sum(flow["discharge"] for flow in energy_flow if flow["hour"] >= 18 or flow["hour"] < 6))
    
    # Create the diagram
    sankey.add(flows=[night_charge, mid_charge, evening_charge, -morning_discharge, -afternoon_discharge, -evening_discharge],
               labels=['Night\nCharging', 'Midday\nCharging', 'Evening\nCharging', 
                      'Morning\nUsage', 'Afternoon\nUsage', 'Evening\nUsage'],
               orientations=[0, 0, 0, 0, 0, 0],
               pathlengths=[0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
               trunklength=10.0,
               patchlabel="Energy Flow")
    
    diagrams = sankey.finish()
    plt.title("Energy Flow Throughout the Day", fontsize=18)
    
    return plot_to_image()

def plot_summary_metrics(schedule):
    """Plot summary metrics for the selected district"""
    
    # Calculate action distribution
    action_counts = schedule["action"].value_counts(normalize=True) * 100
    
    # Calculate average battery level by hour
    battery_by_hour = schedule.groupby("hour")["battery_level"].mean()
    
    # Calculate estimated savings
    savings = []
    for hour in range(24):
        hour_data = schedule[schedule["hour"] == hour]
        hour_savings = 0
        for _, row in hour_data.iterrows():
            if row["action"] == "discharge":
                hour_savings += row["price"] * 0.1  # Assume 0.1 kWh discharge
            elif row["action"] == "charge":
                hour_savings -= row["price"] * 0.1  # Cost of charging
        
        savings.append({"hour": hour, "savings": hour_savings})
    
    savings_df = pd.DataFrame(savings)
    
    # Create visualization
    fig, axs = plt.subplots(2, 2, figsize=(14, 10))
    
    # Plot 1: Action distribution
    ax1 = axs[0, 0]
    ax1.pie(action_counts, labels=action_counts.index, autopct='%1.1f%%', 
            colors=["#7f8c8d", "#2ecc71", "#e74c3c"],
            explode=[0.05, 0.1, 0.05], shadow=True, startangle=90)
    ax1.set_title("Energy Storage Action Distribution", fontsize=14)
    
    # Plot 2: Battery level by hour
    ax2 = axs[0, 1]
    ax2.plot(battery_by_hour.index, battery_by_hour.values, 'o-', linewidth=2, color='#f39c12')
    ax2.fill_between(battery_by_hour.index, battery_by_hour.values, alpha=0.3, color='#f39c12')
    ax2.set_title("Average Battery Level by Hour", fontsize=14)
    ax2.set_xlabel("Hour of Day", fontsize=12)
    ax2.set_ylabel("Battery Level (0-1)", fontsize=12)
    ax2.set_xticks(range(0, 24, 2))
    ax2.grid(True, linestyle='--', alpha=0.7)
    
    # Plot 3: Hourly savings/costs
    ax3 = axs[1, 0]
    positive_savings = savings_df[savings_df["savings"] > 0]
    negative_savings = savings_df[savings_df["savings"] < 0]
    
    if not positive_savings.empty:
        ax3.bar(positive_savings["hour"], positive_savings["savings"], color="#2ecc71", label="Savings")
    if not negative_savings.empty:
        ax3.bar(negative_savings["hour"], negative_savings["savings"], color="#e74c3c", label="Costs")
    
    ax3.set_title("Hourly Savings/Costs", fontsize=14)
    ax3.set_xlabel("Hour of Day", fontsize=12)
    ax3.set_ylabel("Amount (₹)", fontsize=12)
    ax3.set_xticks(range(0, 24, 2))
    ax3.grid(True, linestyle='--', alpha=0.7)
    ax3.legend()
    
    # Plot 4: Cumulative savings
    ax4 = axs[1, 1]
    savings_df["cumulative"] = savings_df["savings"].cumsum()
    ax4.plot(savings_df["hour"], savings_df["cumulative"], '-', linewidth=2, color='#3498db')
    ax4.fill_between(savings_df["hour"], savings_df["cumulative"], alpha=0.3, color='#3498db')
    ax4.set_title("Cumulative Savings Over Day", fontsize=14)
    ax4.set_xlabel("Hour of Day", fontsize=12)
    ax4.set_ylabel("Cumulative Savings (₹)", fontsize=12)
    ax4.set_xticks(range(0, 24, 2))
    ax4.grid(True, linestyle='--', alpha=0.7)
    
    plt.tight_layout()
    return plot_to_image()

# Main application flow
def main():
    district_data = {}
    district_models = {}
    district_schedules = {}
    
    # Main tab system
    tab1, tab2, tab3, tab4 = st.tabs(["📊 District Analysis", "🔋 Charge/Discharge Schedule", "🔄 Energy Flow", "📈 Dashboard"])
    
    with st.spinner(f"Processing data for {chosen_district}..."):
        # Step 1: Load or generate dataset
        data = None
        if not force_regenerate:
            data = load_dataset(chosen_district)
        
        if data is None:
            st.info(f"Generating new synthetic data for {chosen_district}...")
            data = generate_synthetic_data(chosen_district, days=days_to_generate)
            save_dataset(data, chosen_district)
        
        district_data[chosen_district] = data
        
        # Step 2: Load or train RL model
        agent = None
        if not force_retrain:
            agent = load_model(chosen_district, learning_rate=learning_rate, 
                               discount_factor=discount_factor, exploration_rate=exploration_rate)
        
        if agent is None:
            st.info(f"Training new model for {chosen_district}...")
            agent = train_rl_model(data, max_episodes=training_episodes, 
                                   learning_rate=learning_rate, 
                                   discount_factor=discount_factor, 
                                   exploration_rate=exploration_rate)
            save_model(agent, chosen_district)
        
        district_models[chosen_district] = agent
        
        # Step 3: Generate optimal schedule
        schedule = get_optimal_schedule(chosen_district, agent, data)
        save_schedule(schedule, chosen_district)
        district_schedules[chosen_district] = schedule
    
    # Display content in tabs
    with tab1:
        st.header(f"Energy Usage Patterns in {chosen_district}")
        
        col1, col2 = st.columns([3, 1])
        
        with col1:
            daily_patterns_img = plot_daily_patterns(data, chosen_district)
            st.image(daily_patterns_img, use_column_width=True)
        
        with col2:
            st.subheader("District Characteristics")