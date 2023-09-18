import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import sklearn.preprocessing as skp
import os

# for relative pathname
dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, "CO2_Emissions_Canada.csv")
print(dirname)

data = pd.read_csv(filename)
df = data.copy()

print("Data copied")

df = df.rename(
    {
        "Vehicle Class": "Vehicle_Class",
        "Engine Size(L)": "Engine_Size",
        "Fuel Type": "Fuel_Type",
        "Fuel Consumption City (L/100 km)": "Fuel_Consumption_City_(L/100km)",
        "Fuel Consumption Hwy (L/100 km)": "Fuel_Consumption_Hwy_(L/100km)",
        "Fuel Consumption Comb (L/100 km)": "Fuel_Consumption_Comb_(L/100km)",
        "Fuel Consumption Comb (mpg)": "Fuel_Consumption_Comb_(mpg)",
        "CO2 Emissions(g/km)": "CO2_Emissions(g/km)",
    },
    axis=1,
)

# Extract number of gears and transmission type
df["Gears"] = df["Transmission"].str.extract(r"(\d+)").astype(float)
df["Transmission"] = df["Transmission"].str.extract(r"([A-Za-z]+)")

df["Gears"].fillna(df["Gears"].mode()[0], inplace=True)
# Int type
df["Gears"] = df["Gears"].astype(int)

# Select numerical columns
df_num = df.select_dtypes(include=["float64", "int64"])

# Select categorical columns
df_cat = df.select_dtypes(exclude=["float64", "int64"])

# removing unnecessary features
df.drop(["Model"], axis=1, inplace=True)
df_cat.drop(["Model"], axis=1, inplace=True)

df.drop(["Make"], axis=1, inplace=True)
df_cat.drop(["Make"], axis=1, inplace=True)


# as the combination betwween the hwy and the city has its own column
df.drop(["Fuel_Consumption_City_(L/100km)"], axis=1, inplace=True)
df.drop(["Fuel_Consumption_Hwy_(L/100km)"], axis=1, inplace=True)

df_num.drop(["Fuel_Consumption_City_(L/100km)"], axis=1, inplace=True)
df_num.drop(["Fuel_Consumption_Hwy_(L/100km)"], axis=1, inplace=True)

df.drop(["Fuel_Consumption_Comb_(mpg)"], axis=1, inplace=True)
df_num.drop(["Fuel_Consumption_Comb_(mpg)"], axis=1, inplace=True)

# removing outliers - suppose we dont remove the outlier
# Q1 = data.quantile(0.25, numeric_only=True)
# Q3 = data.quantile(0.75, numeric_only=True)


# IQR = Q3 - Q1
# df= df[~((df < (Q1 - 1.5 * IQR)) | (df > (Q3 + 1.5 * IQR))).any(axis=1)]

print("outlier removed")


# using onhot encoding for categorical data
df = pd.concat([df, pd.get_dummies(df["Fuel_Type"], drop_first=True)], axis=1)
df.drop(["Fuel_Type"], axis=1, inplace=True)

df = pd.concat([df, pd.get_dummies(df["Transmission"], drop_first=True)], axis=1)
df.drop(["Transmission"], axis=1, inplace=True)

# organising the data
FEATURES = [
    "Engine_Size",
    "Cylinders",
    "Fuel_Consumption_Comb_(L/100km)",
    "Gears",
    "E",
    "N",
    "X",
    "Z",
    "AM",
    "AS",
    "AV",
    "M",
]
TARGET = "CO2_Emissions(g/km)"
GROUP = "Vehicle_Class"

print("one hot incoding done")
X = df[FEATURES]
y = df[TARGET]
group = df[GROUP]

standarising_data = X[
    ["Engine_Size", "Cylinders", "Fuel_Consumption_Comb_(L/100km)", "Gears"]
]
mms = skp.MinMaxScaler()

for i in enumerate(standarising_data):
    standarising_data[i[1]] = mms.fit_transform(standarising_data[[i[1]]])

print("standarization of numerical data is done")

# storing the min max value for standarising the user input
min_max_info = standarising_data.describe().loc[["min", "max"]]
# Save the min_max_info DataFrame to a CSV file
min_max_info.to_csv("min_max_info.csv")

print("min_max_info saved")
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=11
)


from sklearn.linear_model import LinearRegression

linear_reg = LinearRegression()
linear_reg.fit(X_train, y_train)

print("model trained")

import pickle

modelfilename = os.path.join(dirname, "model.pkl")
pickle.dump(linear_reg, open(modelfilename, "wb"))
model = pickle.load(open("model.pkl", "rb"))

print(" model dumping done")
