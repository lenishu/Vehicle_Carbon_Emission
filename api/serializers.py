from rest_framework import serializers
from .model import PredictedData


class PredictedSerializers(serializers.ModelSerializer):
    class Meta:
        model = PredictedData
        fields = "__all__"
