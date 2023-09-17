from django.db import models

# from django import forms


class PredictedData(models.Model):
    # fueltype = forms.ChoiceField(choices=choices)
    fueltype = models.JSONField()

    def __str__(self):
        return self.fueltype
