// getting data api
let getAPI = async (CompID) =>{
  // Eerst bouwen we onze url op

	const ENDPOINT = `https://api.football-data.org/v2/competitions/${CompID}/standings`;

	// Met de fetch API proberen we de data op te halen.
	const request = await fetch(`${ENDPOINT}`, {
    headers: {
      'X-Auth-Token':  '1ccb3a12707a4b56bc50e6119961ca4a',
    },
    dataType: 'json',
    type: 'GET'
  });
	const data = await request.json();
  showresults(data);
  //Maakt een array voor de chart aan
  var table = new Array()
  //styling van de chart
  table.push(['Result', 'Wins', 'Drawn', 'Lost',{ role: 'style' } ])
  //opvullen array
  data.standings[0].table.forEach(element => {
    table.push([element.team.name, element.won, element.draw, element.lost, ''])
  });
  console.log(table)
  CompetitionName = document.querySelector('.js-Country')
  CompetitionName.innerHTML = data.competition.area.name
  return table;
};

function handleDropdownButton() {
	let show = 'is-open',
		elements = document.getElementsByClassName('js-dropdown-toggle');

	//Hide/Show Dropdown Menu on Click
	for (let i = 0; i < elements.length; i++) {
		elements[i].addEventListener('click', function() {
			removeClass(elements, show);
			if (hasClass(this, show)) {
				removeClass(this, show);
			} else {
				addClass(this, show);
			}
		});
	}

	//Hide Dropdown when clicked outside of the Menu
	document.addEventListener('click', function(event) {
		for (let i = 0; i < elements.length; i++) {
			if (event.target.closest('.js-dropdown-toggle')) return; // closest; van de selector tot aan de root zoeken naar deze selector-string
			removeClass(elements[i], show);
		}
	});

	function addClass(elements, myClass) {
		if (!elements) {
			return;
		}
		if (typeof elements === 'string') {
			elements = document.querySelectorAll(elements);
		} else if (elements.tagName) {
			elements = [elements];
		}
		for (let i = 0; i < elements.length; i++) {
			if ((' ' + elements[i].className + ' ').indexOf(' ' + myClass + ' ') < 0) {
				elements[i].className += ' ' + myClass;
			}
		}
	}
	function removeClass(elements, myClass) {
		if (!elements) {
			return;
		}
		if (typeof elements === 'string') {
			elements = document.querySelectorAll(elements);
		} else if (elements.tagName) {
			elements = [elements];
		}
		let reg = new RegExp('(^| )' + myClass + '($| )', 'g');
		for (let i = 0; i < elements.length; i++) {
			elements[i].className = elements[i].className.replace(reg, ' ');
		}
	}

	function hasClass(element, myClass) {
		return (' ' + element.className + ' ').indexOf(' ' + myClass + ' ') > -1;
	}
}



let showresults = function(data){
  const ranking =document.querySelector('.js-Table');
  var table = '<tr><th>place</th><th>Logo</th><th>name</th><th>W/L/D</th><th>points</th></tr>' 
  data.standings[0].table.forEach(element => {
    table +=`<tr><th>${element.position}</th><th><img class="c-main-nav__icon" src="${element.team.crestUrl}"/></th><th>${element.team.name}</th><th>${element.won}/${element.draw}/${element.lost}</th><th>${element.points}</th></tr>`;
  });
  ranking.innerHTML = table
}

let drawChart = async data =>{
  table = new Array();
  table = await getAPI(data)
  console.log("queryResponse")
  console.log(table)
  var data = google.visualization.arrayToDataTable(table);

var view = new google.visualization.DataView(data);
view.setColumns([0, 1, 2 ,3]);

                 var options = {
  width: 600,
  height: 600,
  legend: { position: 'top', maxLines: 3 },
  bar: { groupWidth: '75%' },
  isStacked: true,
  hAxis: { slantedText:true, slantedTextAngle:90}
};

var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
chart.draw(view, options);
}

const init =() =>{
	
  	CompetitionSelect = document.querySelectorAll('.js-Competition-select');
  	CompetitionSelect.forEach(element=>{
	element.addEventListener('click', function (e) {
		google.charts.setOnLoadCallback(drawChart(e.target.value));
	});
  });
	handleDropdownButton();
}

document.addEventListener('DOMContentLoaded', function() {
  // 1 We will query the API with longitude and latitude.
  google.charts.load("current", {packages:['corechart']});
  google.charts.setOnLoadCallback(drawChart(2021));
  init()
});