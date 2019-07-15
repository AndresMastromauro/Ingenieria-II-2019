from datetime import date, timedelta


def a_year_from_now():
    # TODO: Mover a algun lugar con otros helpers
    today = date.today()
    return date(today.year + 1, today.month, today.day)


def adjust_date_to_last_monday(a_date):
    return a_date - timedelta(days=a_date.weekday())

def adjust_date_to_next_monday(a_date):
    return a_date + timedelta(days=(7 - a_date.weekday()))

def validate_monday(value):
    if not value.isocalendar() [2] == 1 :
        from django.core.exceptions import ValidationError
        raise ValidationError("Debe elegir un Lunes")

def three_days_from_now():
    return date.today() + timedelta(days=3)