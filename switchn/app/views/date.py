from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import BaseAuthentication
from rest_framework.permissions import AllowAny
from datetime import datetime

class DateView (APIView):
    # authentication_classes = [BaseAuthentication]
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        return Response({'today': datetime.today()})