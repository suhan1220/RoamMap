//--------地圖設定
var map = L.map('map').setView([25.0744, 121.5514], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '<a href="https://www.openstreetmap.org/">OSM</a>',
    maxZoom: 18,
}).addTo(map);
var marker = L.marker();
function setMapMarker(x, y) {
    marker.setLatLng([x, y]).addTo(map);
}
function MapMarkerClear() {
    map.removeLayer(marker);
}

//方便查放座標的位置 
var popup = L.popup();
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("這裡是" + e.latlng.toString())
        .openOn(map);
}
map.on('click', onMapClick);

//--------資料秀出
const ListInfo = document.getElementById('info');
const spreadsheet_id = '1NXWNLxCflYBSmBDDwhn6Ij2itmT3kF2QjjevNbeZ9bo';
const tab_name = '工作表1';
const api_key = 'AIzaSyAMpJ-FWW1qt2uH7auDxkPrXc_hkbg9fKw';
var dataurl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}/values/${tab_name}?key=${api_key}`

function getgoogleData() {
    return axios.get(dataurl);
}
var liInfos = [];
Promise.all([getgoogleData()])
    .then(function (results) {
        // console.log(results[0].data);
        ShowData(results[0].data);
    }).catch((error) => console.log(error));



function ShowData(datas) {
    // console.log(datas.values);
    datas.values.shift();
    datas.values.forEach(function (i) {
        // console.log(i);
        const LiDom = document.createElement("li");
        LiDom.setAttribute('class', 'item d-flex shadow-sm border mb-2 px-3 py-2 rounded-4');

        const ImgBox = document.createElement("span");
        ImgBox.setAttribute('class', 'd-block col-4 col-md-3 col-lg-3 pe-3');
        if (i[4] !== undefined) {
            const ImgElement = document.createElement("img");
            ImgElement.setAttribute('src', i[4]);
            ImgElement.setAttribute('class', 'img-fluid');
            ImgBox.appendChild(ImgElement);
        }
        LiDom.appendChild(ImgBox);

        const InfoBox = document.createElement("span");
        InfoBox.setAttribute('class', 'd-block col-8 col-md-9 col-lg-9');

        if (i[5] !== '') {
            const linkWebDom = document.createElement("a");
            linkWebDom.setAttribute('class', 'float-end top-0 text-mb-small d-inline-block text-decoration-none');
            linkWebDom.setAttribute('href', i[5]);
            linkWebDom.setAttribute('target', '_blank');
            linkWebDom.setAttribute('title', i[2] + '官方網站或活動專網(另開新視窗)');
            const WebTxt = document.createTextNode("官網");
            const WebIconDom = document.createElement("span");
            WebIconDom.setAttribute('class', 'material-symbols-outlined align-text-bottom small');
            WebIconDom.setAttribute('aria-hidden', 'true');
            const WebIconTxt = document.createTextNode('open_in_new');
            WebIconDom.appendChild(WebIconTxt);
            linkWebDom.appendChild(WebIconDom);
            linkWebDom.appendChild(WebTxt);
            InfoBox.appendChild(linkWebDom);
        }

        const strongDom = document.createElement("strong");
        strongDom.setAttribute('class', 'title d-block fw-bold pt-2');
        const SchoolTxt = document.createTextNode(i[2]);
        strongDom.appendChild(SchoolTxt);
        InfoBox.appendChild(strongDom);

        const TimeDom = document.createElement("span");
        if (i[1] == '') {
            const TimeTxt = document.createTextNode(`${i[0]}`);
            TimeDom.setAttribute('class', 'time-txt');
            TimeDom.appendChild(TimeTxt);
        } else {
            const TimeTxt = document.createTextNode(`${i[0]} 至 ${i[1]}`);
            TimeDom.setAttribute('class', 'time-txt');
            TimeDom.appendChild(TimeTxt);
        }
        const BrDom = document.createElement("br");
        InfoBox.appendChild(TimeDom);
        InfoBox.appendChild(BrDom);



        let Place = i[7];
        if (Place !== '') {
            const linkPlaceDom = document.createElement("a");
            linkPlaceDom.setAttribute('class', 'text-mb-small d-inline-block pt-2 text-decoration-none me-2');
            linkPlaceDom.setAttribute('href', 'https://www.google.com/maps/search/' + Place);
            linkPlaceDom.setAttribute('target', '_blank');
            const PlaceIconDom = document.createElement("span");
            PlaceIconDom.setAttribute('class', 'material-symbols-outlined align-text-bottom small');
            PlaceIconDom.setAttribute('aria-hidden', 'true');
            const PlaceIconTxt = document.createTextNode('map');
            const PlaceSpanDom = document.createElement("span");
            const PlaceTxt = document.createTextNode(i[6]);
            PlaceIconDom.appendChild(PlaceIconTxt);
            PlaceSpanDom.appendChild(PlaceIconDom);
            PlaceSpanDom.appendChild(PlaceTxt);
            linkPlaceDom.appendChild(PlaceSpanDom);
            InfoBox.appendChild(linkPlaceDom);
        }

        if (i[3] !== undefined) {
            const IntroduceDom = document.createElement("span");
            IntroduceDom.setAttribute('class', 'info-txt text-mb-small d-block small text-secondary');
            const IntroduceTxt = document.createTextNode(i[3]);
            IntroduceDom.appendChild(IntroduceTxt);
            InfoBox.appendChild(IntroduceDom);

            //字數限制刪節號
            var len = 50; // 超過50個字以"..."取代
            var elements = document.querySelectorAll('.info-txt');
            elements.forEach(function (element) {
                if (element.textContent.length > len) {
                    element.setAttribute('title', element.textContent);
                    var text = element.textContent.substring(0, len - 1) + '...';
                    element.textContent = text;
                }
            });

            ////計算版面高度
            let winHeight = Math.round(window.innerHeight);
            let boxTop = Math.round(ListInfo.getBoundingClientRect().top);
            let newHeight = winHeight - boxTop - 16;
            document.querySelector('.container-md').setAttribute('data-height', newHeight);
            // console.log(newHeight);
        }

        LiDom.appendChild(InfoBox);
        ListInfo.appendChild(LiDom);
        if (i[8] !== undefined || i[9] !== undefined) {
            LiDom.addEventListener('mouseenter', function () {
                // console.log(i[8], i[9]);
                setMapMarker(i[8], i[9]);
                map.setView([i[8], i[9]], 17);
            });
            LiDom.addEventListener('click', function () {
                setMapMarker(i[8], i[9]);
                map.setView([i[8], i[9]], 17);
            });
            // LiDom.addEventListener('mouseleave', function () {
            // MapMarkerClear();
            // map.setView([25.0744, 121.5514], 11);
            // });
        } else {
            LiDom.addEventListener('mouseenter', function () {
                MapMarkerClear();
                map.setView([25.0744, 121.5514], 11);
            });
        }

    });
}
// window.addEventListener("orientationchange", function () {
//     // 檢查手機是否處於橫向模式
//     if (window.orientation === 90 || window.orientation === -90) {
//         // alert("目前不支援手機橫向模式");
//         // window.reload();
//     }

//     // 檢查手機是否處於縱向模式
//     if (window.orientation === 0 || window.orientation === 180) {
//         // alert("目前不支援手機縱向模式");
//     }
// });

