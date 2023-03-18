from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from django.views.generic import TemplateView

from .serializers import normalHSerializer,emerHSerializer
from .models import normalH, aedLocation
from .emerH import check_ID, update_hospitalization, search_Emergency
from .aed import search_aed
from django.views.generic import View
import os
from django.http import HttpResponse

from django.conf import settings

#추가할 기능
#업데이트주기
#응급실운영하는 곳의 기관명과 좌표를 넘겨줌 
class locationList(APIView):
    def get(self, request):
        tests = normalH.objects.filter(응급실운영여부 = "True",)
        serializer = emerHSerializer(tests, many=True)
        return Response(serializer.data)

class searchEmergency(APIView):
    def get(self, request, lon, lat, format=None):
        data = search_Emergency(lon=lon, lat=lat)
        return Response(data)


#병원정보를 넘겨줌
class hospitalDetail(APIView):
    def get_objects(self,pk):
        # 병원 입원가용여부를 업데이트 후 오브젝트 반환
        # Update_hospitalization(Check_ID(pk))
        # a= Check_ID(pk)
        try:
            return normalH.objects.filter(기관명 = pk)
        except normalH.DoseNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        list = self.get_objects(pk)
        serializer = normalHSerializer(list, many=True)
        return Response(serializer.data)

class SearchAed(APIView):
    def get(self, request, lon, lat, format=None):
        data = search_aed(lon=lon, lat=lat)
        return Response(data)
