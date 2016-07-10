import htmlPdf from 'html-pdf';
import AWS from 'aws-sdk';
import {awsConfig} from '../../common/config.js';
AWS.config.update(awsConfig.s3);
let s3 = new AWS.S3(awsConfig.s3);

export async function createVoucher(voucher_code, gift_code, plan_name, message) {
  let htmlStream = await generateHtml(gift_code, plan_name, message);
  let pdfStream = await createPdfStream(htmlStream);
  return await sendToS3(pdfStream, voucher_code);
}

function sendToS3(pdfStream, voucher_code) {
  return new Promise((resolve, reject)=> {
    var params = {
      Bucket: 'botm',
      ContentType: 'application/pdf',
      Key: 'gift_certificates/' + voucher_code + '.pdf',
      Body: pdfStream,
      ACL: "public-read"
    };
    s3.upload(params, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function createPdfStream(htmlStr) {
  var options = {
    "format": "Letter",
    "orientation": "landscape",
    "border": {
      "top": "0.15in",
      "right": "0in",
      "bottom": "0in",
      "left": "0in"
    }
  };
  return new Promise((resolve, reject)=> {
    htmlPdf.create(htmlStr, options).toStream(function (err, pdfStream) {
      if (err) reject(err);
      else resolve(pdfStream);
    });
  });
}

function generateHtml(gift_code, plan_name, message) {
  return `<html>
  <head>
    <meta charset="utf8">
    <title>Book of the Month Gift Voucher</title>
    <style>
      html, body {
        background: white;
        font-weight: 500;
        font-size: 9px;
        font-family: 'Open Sans', sans-serif;
      }
      table {
        border-collapse: collapse;
        width:100%;
        height:100%;
      }
      table td, table th {
        border: 1px dashed #e4e4e4;
        width: 50%;
        height: 50%;
        padding: 10px 0;
      }
      table tr:first-child td {
          border-top: 0;
      }
      table tr:last-child td {
          border-bottom: 0;
      }
      table tr td:first-child,
      table tr td:first-child {
          border-left: 0;
      }
      table tr td:last-child,
      table tr td:last-child {
          border-right: 0;
      }
      .box {
        display: block;
        position: relative;
        border: 1px solid #004181;
        width: 95%;
        height: 95%;
      }
      #box1 {
        background-color: white;
        margin-top: 0px;
        margin-right: auto;
        margin-bottom: auto;
        margin-left: 0px;
      }
      #box2 {
        background-color: white;
        margin-top: 0px;
        margin-right: 0px;
        margin-bottom: auto;
        margin-left: auto;
      }
      #box2 p {
        text-align: left;
      }

      #box3 {
        background-color: #004181;
        margin-top: auto;
        margin-right: auto;
        margin-bottom: 0px;
        margin-left: 0px;
        position: relative;
      }
      #box4 {
        background-color: #004181;
        margin-top: auto;
        margin-right: 0px;
        margin-bottom: 0px;
        margin-left: auto;
      }
      p {
        display: block;
        text-align: center;
      }
      img {
        display: block;
        margin-left: auto;
        margin-right: auto;
      }
      #text-logo {
        width: 300px;
      }
      .arabesque {
        width: 20px;
        height: 20px;
        margin-top: 25px;
        margin-bottom:  25px;
      }
      .text-content {
        position: absolute;
        top: 50%;
        left: 50%;
        max-height: 90%;
        overflow: hidden;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
      }
      .text-content p {
        color: #004780;
        min-width: 300px;
        -webkit-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        transform: rotate(180deg);
      }
      .text-content a {
        color: #004780;
      }
      .cover-content {
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
      }
      .cover-content p {
        color: white;
      }

      .dotted-text {
        position: absolute;
        color: #d3d3d3;
      }
      #dotted-text1 {
        top: 48.9%;
        left: 2.8%;
      }
      #dotted-text2 {
        top: 48.9%;
        left: 81%;
      }
      #dotted-text3 {
        top: 12%;
        left: 42.8%;
        -webkit-transform: rotate(-90deg);
        -moz-transform: rotate(-90deg);
        -ms-transform: rotate(-90deg);
        -o-transform: rotate(-90deg);
        transform: rotate(-90deg);
      }
      #dotted-text4 {
        top: 83%;
        left: 42.8%;
        -webkit-transform: rotate(-90deg);
        -moz-transform: rotate(-90deg);
        -ms-transform: rotate(-90deg);
        -o-transform: rotate(-90deg);
        transform: rotate(-90deg);
      }
      .arrow {
        position: absolute;
        width: 10px;
        height: 15px;
      }
      #arrow1 {
        top: 0px;
        left: 49%;
        background-color: white;
        padding-right: 5px;
        -webkit-transform: rotate(-90deg);
        -moz-transform: rotate(-90deg);
        -ms-transform: rotate(-90deg);
        -o-transform: rotate(-90deg);
        transform: rotate(-90deg);
      }
      #arrow2 {
        top: 48.5%;
        left: 98%;
      }
      #arrow3 {
        top: 97%;
        left: 49.5%;
        background-color: white;
        padding-right: 5px;
        -webkit-transform: rotate(90deg);
        -moz-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        -o-transform: rotate(90deg);
        transform: rotate(90deg);
      }
      #arrow4 {
        top: 48.5%;
        left: 1%;
      }
    </style>
  </head>
  <body>
    <table>
        <tr>
          <td>
            <div id="box1" class="box">
              <div class="text-content">
                <p style="color:#00BFFF;margin:5px 0px 5px 0px;">GIFT CODE: ${gift_code}</p>
                <p style="margin:5px 0px 5px 0px;">${plan_name} GIFT MEMBERSHIP</p>
                <img class="arabesque" src="http://localhost:8080/img/arabesque_blue.png">
                <p style="margin:5px 0px 5px 0px;">and enter your gift code.</p>
                <p style="margin:5px 0px 5px 0px;"><a href="http://bookofthemonth.com/gift/redeem" target="_blank" style="text-decoration:none;"><strong>bookofthemonth.com/gift/redeem</strong></a></p>
                <p style="margin:5px 0px 0px 0px;">To redeem your gift membership, visit</p>
              </div>
            </div>
          </td>
          <td>
            <div id="box2" class="box">
              <div class="text-content">
                <p>${message}</p>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div id="box3" class="box">
              <div class="cover-content">
                <img id="logo" src="http://localhost:8080/img/logos/logo_coin_large_white.png" width="100" height="100">
                <p>Happy Reading!</p>
              </div>
            </div>
          </td>
          <td>
              <div id="box4" class="box">
                <div class="cover-content">
                  <img id="text-logo" src="http://localhost:8080/img/logos/logo_text_white.png">
                  <img class="arabesque" src="http://localhost:8080/img/arabesque_white.png">
                  <p style="margin:0px 0px 5px 0px;">YOU HAVE RECEIVED</p>
                  <p style="margin:0px;">THE GIFT OF READING</p>
                </div>
              </div>
          </td>
        </tr>
    </table>
    <p id="dotted-text1" class="dotted-text">STEP 1: Fold along dotted line</p>
    <p id="dotted-text2" class="dotted-text">STEP 1: Fold along dotted line</p>
    <p id="dotted-text3" class="dotted-text">STEP 2: Fold along dotted line</p>
    <p id="dotted-text4" class="dotted-text">STEP 2: Fold along dotted line</p>
    <img id="arrow1" class="arrow" src="http://localhost:8080/img/voucher_arrow1.png">
    <img id="arrow2" class="arrow" src="http://localhost:8080/img/voucher_arrow1.png">
    <img id="arrow3" class="arrow" src="http://localhost:8080/img/voucher_arrow1.png">
    <img id="arrow4" class="arrow" src="http://localhost:8080/img/voucher_arrow2.png">
  </body>
  </html>`
}
