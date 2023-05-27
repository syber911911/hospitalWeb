from django.contrib import admin
from .models import normalH, aedLocation

class normalHAdmin(admin.ModelAdmin):
    list_display = ['id', '기관명', '병원분류명', '응급실운영여부', '주소', '기관ID']
    search_fields = ['기관명']

class aedAdmin(admin.ModelAdmin):
    list_display = ['id', '설치기관명', '설치장소', '관리자', '관리자연락처', '경도', '위도', '우편번호']
    search_fields = ['설치장소']

admin.site.register(normalH, normalHAdmin)
admin.site.register(aedLocation, aedAdmin)
