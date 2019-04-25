import * as domtoimage from 'dom-to-image';
import * as jsPDF from 'jspdf';
import { Injectable } from '@angular/core';

@Injectable()
export class EsCommonService {
    public onDay: number = 86400000;
    constructor() {
        window['jsPDF'] = jsPDF;
    }

    getFormatDate(date, fmt) {
        let o = {
            "M+": date.getMonth() + 1,                 //月份 
            "d+": date.getDate(),                      //日 
            "h+": date.getHours(),                     //小时 
            "m+": date.getMinutes(),                   //分 
            "s+": date.getSeconds(),                   //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds()               //毫秒 
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    getStatus(status) {
        if (status == 'running') {
            return "运行中";
        } else {
            return "停止中";
        }
    }

    downloadPdf(id) {
        window['jsPDF'] = jsPDF;
        let node = document.getElementById(id);
        domtoimage.toJpeg(node, {
            quality: 1.0,
            bgcolor: '#fff',
            style: {
                'opacity': '1',
                'top': '0',
                'left': '0'
            }
        })
            .then(function (dataUrl) {
                let img = new Image();
                img.src = dataUrl;
                img.onload = function () {
                    let pdf = new jsPDF();
                    pdf.addImage(dataUrl, 'JPEG', 14, 10, img.width / 12, img.height / 12);//300DPI 1mm=12px
                    pdf.save(`${name}.pdf`);
                }


            })
            .then(() => {
                //this.downReport = false;
            });
    }

    drawIcon(ctx, posX, posY, imgSrc, imgWidth = 56, imgHeight = 56) {
        let img = new Image();
        img.src = imgSrc;
        img.onload = function () {
            ctx.drawImage(img, posX, posY - imgHeight / 2 - 60);
        }
    }

    drawHead(ctx, x0, y0, x1, y1, x2, y2, color?, width?) {
        var radius = 3, twoPI = 2 * Math.PI;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = color || '#cbcbcb';
        ctx.fillStyle = color || '#cbcbcb';
        ctx.lineWidth = width || 1;
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x0, y0);
        ctx.fill();
        ctx.restore();
    }

    drawArrow(ctx, x1, y1, x2, y2, color?, width?, which?, angle?, d?) {
        if (typeof (x1) == 'string') {
            x1 = parseInt(x1);
        }
        if (typeof (y1) == 'string') {
            y1 = parseInt(y1);
        }
        if (typeof (x2) == 'string') {
            x2 = parseInt(x2);
        }
        if (typeof (y2) == 'string') {
            y2 = parseInt(y2);
        }
        which = typeof (which) != 'undefined' ? which : 1;
        angle = typeof (angle) != 'undefined' ? angle : 0.5;
        d = typeof (d) != 'undefined' ? d : 10;
        color = typeof (color) != 'undefined' ? color : '#cbcbcb';
        width = typeof (width) != 'undefined' ? width : 1;        
        var dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        var ratio = (dist - d / 3) / dist;
        var tox, toy, fromx, fromy;
        if (which & 1) {
            tox = Math.round(x1 + (x2 - x1) * ratio);
            toy = Math.round(y1 + (y2 - y1) * ratio);
        } else {
            tox = x2;
            toy = y2;
        }

        if (which & 2) {
            fromx = x1 + (x2 - x1) * (1 - ratio);
            fromy = y1 + (y2 - y1) * (1 - ratio);
        } else {
            fromx = x1;
            fromy = y1;
        }

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.stroke();

        var lineangle = Math.atan2(y2 - y1, x2 - x1);
        var h = Math.abs(d / Math.cos(angle));
        if (which & 1) {
            var angle1 = lineangle + Math.PI + angle;
            var topx = x2 + Math.cos(angle1) * h;
            var topy = y2 + Math.sin(angle1) * h;
            var angle2 = lineangle + Math.PI - angle;
            var botx = x2 + Math.cos(angle2) * h;
            var boty = y2 + Math.sin(angle2) * h;
            this.drawHead(ctx, topx, topy, x2, y2, botx, boty, color, width);
        }

        if (which & 2) {
            var angle1 = lineangle + angle;
            var topx = x1 + Math.cos(angle1) * h;
            var topy = y1 + Math.sin(angle1) * h;
            var angle2 = lineangle - angle;
            var botx = x1 + Math.cos(angle2) * h;
            var boty = y1 + Math.sin(angle2) * h;
            this.drawHead(ctx, topx, topy, x1, y1, botx, boty, color, width);
        }
    }

    drawLeftPointToPoint(ctx, fromX, fromY, toX, toY, left?, width?, color?) {
        if (left == null) {
            left = 10;
        }
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(fromX + left, fromY);
        ctx.lineTo(fromX + left, toY);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.restore();
        this.drawArrow(ctx, fromX + left, toY, toX, toY, color, width);
    }

    drawUpPointToPoint(ctx, fromX, fromY, toX, toY, up?, width?, color?) {
        if (up == null) {
            up = 10;
        }
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(fromX, fromY - up);
        ctx.moveTo(toX, fromY - up);
        ctx.lineTo(fromX, fromY - up);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.restore();
        this.drawArrow(ctx, toX, fromY - up, toX, toY, color, width);
    }
}
