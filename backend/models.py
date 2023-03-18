from django.db import models

class normalH(models.Model):
    id = models.IntegerField(null=False)
    주소 = models.TextField(blank=True, null=True)
    병원분류명 = models.TextField(blank=True, null=True)
    응급의료기관코드명 = models.TextField(blank=True, null=True)
    응급실운영여부 = models.TextField(blank=True, null=True)
    입원가능여부 = models.TextField(blank=True, null=True)
    응급실병상 = models.TextField(blank=True, null=True)
    수술실병상 = models.TextField(blank=True, null=True)
    입원실병상 = models.TextField(blank=True, null=True)
    기관명 = models.TextField(blank=True, primary_key=True)
    대표전화1 = models.TextField(blank=True, null=True)
    응급실전화 = models.TextField(blank=True, null=True)
    월요진료 = models.TextField(blank=True, null=True)
    화요진료 = models.TextField(blank=True, null=True)
    수요진료 = models.TextField(blank=True, null=True)
    목요진료 = models.TextField(blank=True, null=True)
    금요진료 = models.TextField(blank=True, null=True)
    토요진료 = models.TextField(blank=True, null=True)
    일요진료 = models.TextField(blank=True, null=True)
    공휴일진료 = models.TextField(blank=True, null=True)
    기관ID = models.TextField(blank=True, null=True)  # Field name made lowercase.
    병원경도 = models.TextField(blank=True, null=True)
    병원위도 = models.TextField(blank=True, null=True)



    class Meta:
        managed = False
        db_table = 'normalH'

class aedLocation(models.Model):
    id = models.IntegerField(null=False, primary_key=True)
    설치기관명 = models.TextField(blank=True, null=True)
    설치장소 = models.TextField(blank=True, null=True)
    관리자 = models.TextField(blank=True, null=True)
    관리자연락처 = models.TextField(blank=True, null=True)
    경도 = models.TextField(blank=True, null=True)
    위도 = models.TextField(blank=True, null=True)
    우편번호 = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'AED'

