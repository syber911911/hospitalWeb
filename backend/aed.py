import pymysql

def search_aed(lon, lat):
    conn = pymysql.connect(
        host="heejun-db.ccg9hgcld4q0.ap-northeast-2.rds.amazonaws.com",
        port=3306,
        user='master',
        password='lhj981023!',
        database='hospitalDB',
        charset='utf8'
    )
    curs = conn.cursor()
    curs1 = conn.cursor()
    sql = "SELECT id, 설치기관명, (6371*acos(cos(radians(%s))*cos(radians(위도))*cos(radians(경도) -radians(%s))+sin(radians(%s))*sin(radians(위도)))) AS distance FROM AED Having distance<3 order by distance;"
    val = (lat), (lon), (lat)
    curs.execute(sql, val)
    temp = list(curs.fetchall())
    places = get_place(temp)
    data = {}
    attribute = ["id", "설치기관명", "설치장소", "관리자", "관리자연락처", "경도", "위도", "우편번호"]

    for i in range(len(places)):
        values = {}
        values["거리"] = temp[i][2]
        sql1 = "select * from AED where id = %s"
        val1 = (temp[i][0])
        curs1.execute(sql1, val1)
        value = curs1.fetchall()
        for j in range(len(attribute)):
            values[attribute[j]] = value[0][j]
            data[places[i]] = values

    conn.close()
    return data

def get_place(list):
    length = len(list)
    places = []
    for i in range(length):
        places.append(list[i][1])
    return places
