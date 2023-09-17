from rest_framework.response import Response
from rest_framework.decorators import api_view
import pandas as pd
import numpy as np
import pickle
import os

dirname = os.path.dirname(__file__)

modelfilename = os.path.join(dirname, "model.pkl")
print(modelfilename)
model = pickle.load(open(modelfilename, "rb"))


# function for standarizing the input
def standarise_the_input(user_input):
    standardized_user_input = []

    loaded_min_max_info = pd.read_csv("min_max_info.csv", index_col=0)
    for i in range(len(user_input)):
        feature = user_input[i]
        min_value = loaded_min_max_info.loc["min", loaded_min_max_info.columns[i]]
        max_value = loaded_min_max_info.loc["max", loaded_min_max_info.columns[i]]
        standardized_feature = (feature - min_value) / (max_value - min_value)
        standardized_user_input.append(standardized_feature)
    return standardized_user_input


# home route for api testing
@api_view(["GET"])
def getData(request):
    person = {"name": "suraj", "age": 22}
    return Response(person)


# @api_view(["GET"])
# def getPredictedData(request):
#     return Response(value)


@api_view(["POST"])
def setPredictedData(request):
    returnedValue = standarise_the_input((request.data["nums"]))
    print(np.rint((returnedValue)))
    print("data standarised")
    user_input = (
        (returnedValue)
        + (request.data["Options"])
        + (request.data["transmissionOptions"])
    )
    user_input = np.asarray(user_input).reshape(1, -1)
    print("data is reshaped")
    value = model.predict(user_input)
    return Response(value)
