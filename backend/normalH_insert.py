# -*- coding: utf-8 -*-
import requests
import pprint
import bs4
import pymysql.cursors

#전국 병_의원 찾기 서비스 인증키
endcoding = 'wItgDoQLzC%2BVn6N5Koy6DraTZSDtYGe8fm1VQgdH0K27dILcIOgtp7PO0jQeBLjRhUzJbFpl9lhn2i7eavZEzg%3D%3D'
decoding = 'wItgDoQLzC+Vn6N5Koy6DraTZSDtYGe8fm1VQgdH0K27dILcIOgtp7PO0jQeBLjRhUzJbFpl9lhn2i7eavZEzg=='
print("[START]")

# request url정의
url = 'http://apis.data.go.kr/B552657/HsptlAsembySearchService/getHsptlMdcncFullDown'

conn = pymysql.connect(
    host="heejun-db.ccg9hgcld4q0.ap-northeast-2.rds.amazonaws.com",
    port=3306,
    user='master',
    password='lhj981023!',
    database='hospitalDB',
    charset='utf8'
)
#해당하는 태그의 내용이 None일 경우 X로 치환
def tagElement(input_xml):
    if input_xml == None:
        return "X"
    else:
        return input_xml.text

#두 시간을 ~로 합쳐서 표기
def serviceTime(input_xml1, input_xml2):
    if tagElement(input_xml1)!="X":
        return insert(input_xml1)+" ~ "+insert(input_xml2)
    else:
        return "X"

#시간 표시를 위해 :을 추가
def insert(input_xml):
    temp = list(input_xml.text)
    temp.insert(2,":")
    return ''.join(temp)

#응급실 운영 판단을 위해 True False 추가
def emergency_Check(input_xml):
    if input_xml.text == "1":
        return "True"
    else:
        return "False"

#DB에 처음 데이터를 몰아 넣기 위한 메소드
def updateDb(page):
    for i in range(1, page):
        params = {'serviceKey' : decoding, 'pageNo' : i, 'numOfRows' : '1000'}
        response = requests.get(url, params=params)
        content = response.text.encode('utf-8')
        xml_obj = bs4.BeautifulSoup(content, 'lxml-xml')
        rows = xml_obj.findAll('item')
        for j in range(0, len(rows)):
            sql = "INSERT IGNORE INTO normalH(주소, 병원분류명, 응급의료기관코드명, 응급실운영여부, 기관명, 대표전화1, 응급실전화, 월요진료, 화요진료, 수요진료, 목요진료, 금요진료, 토요진료, 일요진료, 공휴일진료, 기관ID, 병원경도, 병원위도) " \
                  "VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
            val = (tagElement(rows[j].dutyAddr), tagElement(rows[j].dutyDivNam),
                   tagElement(rows[j].dutyEmclsName), emergency_Check(rows[j].dutyEryn),
                   tagElement(rows[j].dutyName), tagElement(rows[j].dutyTel1), tagElement(rows[j].dutyTel3),
                   serviceTime(rows[j].dutyTime1s, rows[j].dutyTime1c),
                   serviceTime(rows[j].dutyTime2s, rows[j].dutyTime2c),
                   serviceTime(rows[j].dutyTime3s, rows[j].dutyTime3c),
                   serviceTime(rows[j].dutyTime4s, rows[j].dutyTime4c),
                   serviceTime(rows[j].dutyTime5s, rows[j].dutyTime5c),
                   serviceTime(rows[j].dutyTime6s, rows[j].dutyTime6c),
                   serviceTime(rows[j].dutyTime7s, rows[j].dutyTime7c),
                   serviceTime(rows[j].dutyTime8s, rows[j].dutyTime8c),
                   tagElement(rows[j].hpid), tagElement(rows[j].wgs84Lat), tagElement(rows[j].wgs84Lon))
            curs.execute(sql, val)
        print(74 - i, "개 남음")  # 진행률

#DB 업데이트를 위한 메소드
def firstInput(page):
    for i in range(1, page):
        params = {'serviceKey' : decoding, 'pageNo' : i, 'numOfRows' : '1000'}
        response = requests.get(url, params=params)
        content = response.text.encode('utf-8')
        xml_obj = bs4.BeautifulSoup(content, 'lxml-xml')
        rows = xml_obj.findAll('item')
        for j in range(0, len(rows)):
            sql = "INSERT INTO normalH(주소, 병원분류명, 응급의료기관코드명, 응급실운영여부, 기관명, 대표전화1, 응급실전화, 월요진료, 화요진료, 수요진료, 목요진료, 금요진료, 토요진료, 일요진료, 공휴일진료, 기관ID, 병원경도, 병원위도) " \
                  "VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)" \
                  "ON DUPLICATE KEY UPDATE 주소 = VALUES(주소), 병원분류명 = VALUES(병원분류명), 응급의료기관코드명 = VALUES(응급의료기관코드명), 응급실운영여부 = VALUES(응급실운영여부), 기관명 = VALUES(기관명)," \
                  "대표전화1 = VALUES(대표전화1), 응급실전화 = VALUES(응급실전화), 월요진료 = VALUES(월요진료), 화요진료 = VALUES(화요진료), 수요진료 = VALUES(수요진료), 목요진료 = VALUES(목요진료), 금요진료 = VALUES(금요진료)," \
                  "토요진료 = VALUES(토요진료), 일요진료 = VALUES(일요진료), 공휴일진료 = VALUES(공휴일진료), 기관ID = VALUES(기관ID), 병원경도 = VALUES(병원경도), 병원위도 = VALUES(병원위도)"
            val = (tagElement(rows[j].dutyAddr), tagElement(rows[j].dutyDivNam),
                   tagElement(rows[j].dutyEmclsName), emergency_Check(rows[j].dutyEryn),
                   tagElement(rows[j].dutyName), tagElement(rows[j].dutyTel1), tagElement(rows[j].dutyTel3),
                   serviceTime(rows[j].dutyTime1s, rows[j].dutyTime1c),
                   serviceTime(rows[j].dutyTime2s, rows[j].dutyTime2c),
                   serviceTime(rows[j].dutyTime3s, rows[j].dutyTime3c),
                   serviceTime(rows[j].dutyTime4s, rows[j].dutyTime4c),
                   serviceTime(rows[j].dutyTime5s, rows[j].dutyTime5c),
                   serviceTime(rows[j].dutyTime6s, rows[j].dutyTime6c),
                   serviceTime(rows[j].dutyTime7s, rows[j].dutyTime7c),
                   serviceTime(rows[j].dutyTime8s, rows[j].dutyTime8c),
                   tagElement(rows[j].hpid), tagElement(rows[j].wgs84Lat), tagElement(rows[j].wgs84Lon))
            curs.execute(sql, val)
        print(74 - i, "개 남음")  # 진행률

curs = conn.cursor()
firstInput(75)
#updateDb(75)
conn.commit()
conn.close()