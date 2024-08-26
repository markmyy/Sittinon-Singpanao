const express = require('express')
const mysql = require('mysql')
const app = express()
const port = 3000
const bcrypt = require('bcrypt') //ใช้สำหรับเข้ารหัสรหัสผ่าน
const saltRounds = 10; //จำนวนรอบในการเข้ารหัส

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "1234",
        database: "shopdee"
    }
)
db.connect()
    if (err) throw err; //ตรวจสอบว่ามีข้อผิดพลาดไหมถ้ามีจะโยนออกมาและหยุดทำงาน แล้วแสดงข้อผิดพลลาด
    console.log("Connected to database")


app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.post('/product',function(req, res){
    const { productName, productDetail, price, cost, quantity} = req.body;
    let sql = "INSERT INTO product (productName, productDetail, price, cost, quantity) VALUES (?,?,?,?,?)" //ใช้สำหรับการแทรกค่าข้อมูลโดยใช้?แทนค่าที่ถูกระบุ
    db.query(sql,[productName, productDetail, price, cost, quantity],
         [productName, productDetail, price, cost, quantity], function(err, result){ //จะใช้เช็คว่ามีข้อผิดพลาดไหม
            if (err) throw err;
            res.send ({'message':'บันทีกข้อมูลสำเร็จ','status' : true})
        }
    )
})

app.get('/product/:id', function(req, res){
        const productID = req.params.id;
        let sql = "SELECT * FROM product WHERE productID = ? "
            sql += "productID=" + productID;
        db.query(sql,function(err, result) {
                if (err) throw err;
                res.send(result);
            }
        );
    }
);
// sql += มีช่องโหว่ที่สามารถทำให้แฮกเกอร์สารมารถเข้ามาแทรกแซงได้
app.post('/login', function(req, res){
    const {username, password} = req.body
    let sql = "SELECT * FROM customer WHERE username = ? AND password = ? AND isActive = 1"
    db.query(sql, [username, password], function(err, result){
        if(err) throw err
        if(result.length > 0){
            let customer = result[0]
            customer ['message'] = "เข้าสู่ระบบสำเร็จ"
            customer['status'] = true
            res.send(customer)
        }else{
            res.send({"message":"กรุณาระบุรหัสผ่านใหม่อีกครั้ง",
                                "status" : false })
        }
    })
})

app.listen(port, function(){
    console.log(`server listening on port + ${port}`) //ใช้ ิblackstick เผื่อให้ฝังค่าportลงในข้อความได้
})