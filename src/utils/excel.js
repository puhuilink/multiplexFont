/* eslint-disable */
require('script-loader!xlsx-style/dist/xlsx.full.min.js');
function auto_width(ws, data) {
  /*set worksheet max width per col*/
  const colWidth = data.map(row => row.map(val => {
    /*if null/undefined*/
    if (val == null) {
      return { 'wch': 10 };
    }
    /*if chinese*/
    else if (val.toString().charCodeAt(0) > 255) {
      return { 'wch': val.toString().length * 2 };
    } else {
      return { 'wch': val.toString().length };
    }
  }))
  /*start in the first row*/
  let result = colWidth[0];
  for (let i = 1; i < colWidth.length; i++) {
    for (let j = 0; j < colWidth[i].length; j++) {
      if (result[j]['wch'] < colWidth[i][j]['wch']) {
        result[j]['wch'] = colWidth[i][j]['wch'];
      }
    }
  }
  ws['!cols'] = result;
}

function json_to_array(key, jsonData) {
  return jsonData.map(v => key.map(j => { return v[j] }));
}

// fix data,return string
function fixdata(data) {
  let o = ''
  let l = 0
  const w = 10240
  for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
  return o
}

// get head from excel file,return array
function get_header_row(sheet) {
  const headers = []
  const range = XLSX.utils.decode_range(sheet['!ref'])
  let C
  const R = range.s.r /* start in the first row */
  for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
    var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* find the cell in the first row */
    var hdr = 'UNKNOWN ' + C // <-- replace with your desired default
    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
    headers.push(hdr)
  }
  return headers
}

export const export_table_to_excel = (id, filename) => {
  const table = document.getElementById(id);
  const wb = XLSX.utils.table_to_book(table);
  XLSX.writeFile(wb, filename);

  /* the second way */
  // const table = document.getElementById(id);
  // const wb = XLSX.utils.book_new();
  // const ws = XLSX.utils.table_to_sheet(table);
  // XLSX.utils.book_append_sheet(wb, ws, filename);
  // XLSX.writeFile(wb, filename);
}

export const export_json_to_excel = ({ data, key, title, filename, autoWidth }) => {

  data.unshift(title);
  var wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data);

  if (autoWidth) {
    const arr = json_to_array(key, data);
    auto_width(ws, arr);
  }
  XLSX.utils.book_append_sheet(wb, ws, filename);
  XLSX.writeFile(wb, filename + '.xlsx');
}

export const export_array_to_excel = ({ key, data, title, filename, autoWidth, merges, cellColor }) => {
  const otherdata = json_to_array(key, data);
  const arr = [...title, ...otherdata];
  var ws_name = filename;

  var wb = new Workbook(),
    ws = sheet_from_array_of_arrays(arr);
  if (autoWidth) {
    /*设置worksheet每列的最大宽度*/
    const colWidth = arr.map(row => row.map(val => {
      /*先判断是否为null/undefined*/
      if (val == null || val == undefined) {
        return { 'wch': 10 };
      }
      /*再判断是否为中文*/
      else if (val.toString().charCodeAt(0) > 255) {
        return { 'wch': val.toString().length * 2 };
      } else {
        return { 'wch': val.toString().length };
      }
    }))
    /*以第一行为初始值*/
    let result = colWidth[0];
    for (let i = 1; i < colWidth.length; i++) {
      for (let j = 0; j < colWidth[i].length; j++) {
        if (result[j]['wch'] < colWidth[i][j]['wch']) {
          result[j]['wch'] = colWidth[i][j]['wch'];
        }
      }
    }
    ws['!cols'] = result;
  }


  if (merges) {
    let ergs = []
    merges.map(item => {
      ergs.push({ //合并第一行数据[B1,C1,D1,E1]
        s: { //s为开始
          c: item[0], //开始列
          r: item[1] //开始取值范围
        },
        e: { //e结束
          c: item[2], //结束列
          r: item[3] //结束范围
        }
      })
    });
    ws["!merges"] = ergs;
  }

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;
  for (var k in wb.Sheets[ws_name]) {
    if (!k.includes('!')) {
      wb.Sheets[ws_name][k].s = {
        alignment: { vertical: 'center', horizontal: 'center' },
        border: {
          top: { style: 'thin', color: 'black' },
          bottom: { style: 'thin', color: 'black' },
          left: { style: 'thin', color: 'black' },
          right: { style: 'thin', color: 'black' }
        }
      };
    }
  }
  if (cellColor) {
    cellColor.map(item => {
      var coor = coordinate(item.a);
      if (wb.Sheets[ws_name][coor] != undefined) {

        if (item.b != undefined && item.b != null && item.b != "") {
          wb.Sheets[ws_name][coor].s.fill = { bgColor: { indexed: 64 }, fgColor: { rgb: item.b } }
        }
        if (item.c != undefined && item.c != null && item.c != "") {
          wb.Sheets[ws_name][coor].s.font = { sz: 14, color: { rgb: item.c } }
          // font: { sz: 14, bold: true, color: { rgb: "FFFFAA00" }
        }
      }
    })
  }
  var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
  var FileSaver = require('file-saver');
  FileSaver.saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), filename + ".xlsx")
}

export const export_array_to_excels = ({ Data, filename, keyMap, head,deviation }) => {
  var wb = null;
  if(Data.length==0){
    wb = format2WB(head, filename, undefined,head['!ref']);
  }else{
    var data = format2Sheet(Data, 0, deviation?deviation:3, keyMap);//偏移3行按keyMap顺序转换
    var dataKeys = Object.keys(data);
    for (var k in head)
      data[k] = head[k];//追加列头
     wb = format2WB(data, filename, undefined, "A1:" + dataKeys[dataKeys.length - 1]);
  }
  var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
  var FileSaver = require('file-saver');
  FileSaver.saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), filename + ".xlsx")
}

function format2WB(sheetData, title, wb, ref) {
  title = title || "mySheet";
  var outputPos = Object.keys(sheetData);
  if (!wb) wb = { Sheets: {}, SheetNames: [] };
  wb.SheetNames.push(title);
  wb.Sheets[title] = Object.assign({}, sheetData, {
    '!ref': ref || (outputPos[0] + ':' + outputPos.reverse().find(_ => _.indexOf("!") == -1))//设置填充区域
  });
  for (var k in wb.Sheets[title]) {
    if (!k.includes('!')) {
      wb.Sheets[title][k].s = {
        alignment: { vertical: 'center', horizontal: 'center' },
        border: {
          top: { style: 'thin', color: 'black' },
          bottom: { style: 'thin', color: 'black' },
          left: { style: 'thin', color: 'black' },
          right: { style: 'thin', color: 'black' }
        }
      };
    }
  }
  return wb;
}

function format2Sheet(json, n, r, keyMap, t) {
  if (json.length != 0) {
    keyMap = keyMap || Object.keys(json[0]);
    var types = (t == undefined ? ((v) => (({ "number": "n", undefined: "s", "boolean": "b", "string": "s" })[typeof v]) || "s") : t);
    n = n || 0;
    r = r || 0;
    var tmpdata = {};//用来保存转换好的json 
    var t1 = json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
      v: v[k],
      position: ((j + n) > 25 ? getCharCol((j + n)) : String.fromCharCode(65 + (j + n))) + (i + 1 + r),
    }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
      v: v.v,
      t: types ? types(v.v) : "s"
    });
    return tmpdata;
  }else{
    return {};
  }

}


function getCharCol(n) {
  let temCol = '',
    s = '',
    m = 0
  while (n > 0) {
    m = n % 26 + 1
    s = String.fromCharCode(m + 64) + s
    n = (n - m) / 26
  }
  return s
}

export const read = (data, type) => {
  /* if type == 'base64' must fix data first */
  // const fixedData = fixdata(data)
  // const workbook = XLSX.read(btoa(fixedData), { type: 'base64' })
  const workbook = XLSX.read(data, { type: type });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const header = get_header_row(worksheet);
  const results = XLSX.utils.sheet_to_json(worksheet);
  return { header, results };
}

function coordinate(item) {
  var coordinate = "";
  if (!item == "") {
    var numb = item[0] / 26;
    if (numb < 1) {
      coordinate = AABB(item[0]) + item[1]
    } else {
      // for (let i = 0; i < parseInt(item[0] / 26); i++) {
      //     coordinate = (AABB(parseInt(item[0] / 26)-1) == 0 ? "A" : AABB(parseInt(item[0] / 26)-1)) + AABB(item[0] % 26) + item[1];
      // }
      coordinate = (AABB(parseInt(item[0] / 26) - 1) == 0 ? "A" : AABB(parseInt(item[0] / 26) - 1)) + AABB(item[0] % 26) + item[1];
    }
    return coordinate;
  }
}

function AABB(num) {
  switch (num) {
    case 0:
      num = "A"
      break;
    case 1:
      num = "B"
      break;
    case 2:
      num = "C"
      break;
    case 3:
      num = "D"
      break;
    case 4:
      num = "E"
      break;
    case 5:
      num = "F"
      break;
    case 6:
      num = "G"
      break;
    case 7:
      num = "H"
      break;
    case 8:
      num = "I"
      break;
    case 9:
      num = "J"
      break;
    case 10:
      num = "K"
      break;
    case 11:
      num = "L"
      break;
    case 12:
      num = "M"
      break;
    case 13:
      num = "N"
      break;
    case 14:
      num = "O"
      break;
    case 15:
      num = "P"
      break;
    case 16:
      num = "Q"
      break;
    case 17:
      num = "R"
      break;
    case 18:
      num = "S"
      break;
    case 19:
      num = "T"
      break;
    case 20:
      num = "U"
      break;
    case 21:
      num = "V"
      break;
    case 22:
      num = "W"
      break;
    case 23:
      num = "X"
      break;
    case 24:
      num = "Y"
      break;
    case 25:
      num = "Z"
      break;
    default:
      num = 0;
      break;
  }
  return num;
}

function sheet_from_array_of_arrays(data, opts = 0) {
  var ws = {};
  var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      var cell = { v: data[R][C] };
      if (cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

      if (typeof cell.v === 'number') cell.t = 'n';
      else if (typeof cell.v === 'boolean') cell.t = 'b';
      else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else cell.t = 's';

      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

export default {
  export_table_to_excel,
  export_array_to_excel,
  export_json_to_excel,
  export_array_to_excels,
  read
}
