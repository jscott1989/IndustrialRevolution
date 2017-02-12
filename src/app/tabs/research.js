import Handlebars from "handlebars"
import $ from "jQuery"
import { game } from "../main"
import vis from "Vis"

var source   = $("#completed-research-template").html()
var template = Handlebars.compile(source)

export const update = (researchCompleted) => {
	// https://spreadsheets.google.com/feeds/list/1z2p2Pd5gIS1n--KIc9uSpC-Poa6gUIgJ3S90c-Lf7q8/1/public/basic?alt=json


    var html = _.map(researchCompleted, (research) => {
        return template(research)
    }).join("");
    $("#completed_research_table > table").html(html);

    var DIR = '/assets/tech_images/';

	var nodes = null;
    var edges = [];
    var network = null;

      nodes = _.map(researchCompleted, (research) => {
      	  var hidden = !research.completed;
      	  /*if(research.start_x != null && research.start_y != null)
	      	  return {x:research.start_x,y:research.start_y,id: research.id, label: research.name, shape: 'circularImage', image: DIR + research.name + '.png', brokenImage: DIR + 'tech.jpeg', hidden: hidden}
  		  else
              return {id: research.id, label: research.name, shape: 'circularImage', image: DIR + research.name + '.png', brokenImage: DIR + 'tech.jpeg', hidden: hidden}
          */
          return {id: research.id, label: research.name, shape: 'circularImage', image: DIR + research.name + '.png', brokenImage: DIR + 'tech.jpeg'}
      });

      // create connections between people
      // value corresponds with the amount of contact between two people
      /*edges = [
        {from: 1, to: 2},
        {from: 2, to: 3},
        {from: 2, to: 4},
        {from: 4, to: 5},
        {from: 4, to: 10},
        {from: 4, to: 6},
        {from: 6, to: 7},
        {from: 7, to: 8},
        {from: 8, to: 9},
        {from: 8, to: 10},
        {from: 10, to: 11},
        {from: 11, to: 12},
        {from: 12, to: 13},
        {from: 13, to: 14},
        {from: 9, to: 16}
      ];*/
      for(var i=0; i<researchCompleted.length; i++) {
      	var research = researchCompleted[i];
      	for(var j=0; j<research.prerequisites.length; j++) {
      		var prerequisite = research.prerequisites[j];
      		edges.push({from: research.id, to: prerequisite})
      	}
      }
      //console.log(edges);
      console.log(nodes);

      // create a network
      var container = document.getElementById('research_tech_tree');
      var data = {
        nodes: nodes,
        edges: edges
      };
      var options = {
        nodes: {
          borderWidth:4,
          size:30,
	      color: {
            border: '#222222',
            background: '#ffffff'
          },
          font:{color:'#000000'}
        },
        edges: {
          color: '#000000'
        },
        physics: {
        	enabled: true,
        },
        interaction: {
        	dragNodes: false
        },
        layout: {
        	randomSeed: 15746
        }
      };
      network = new vis.Network(container, data, options);

      //console.log(network.getScale());
      //network.setSize('100px','100px');
      //network.focus({nodes:[1,2,3,4,5]});
      network.moveTo({position: {x:-320, y:-190}});
      console.log("Seed: "+network.getSeed());

      network.on("click", function (params) {
        params.event = "[original event]";
        //document.getElementById('eventSpan').innerHTML = '<h2>Click event:</h2>' + JSON.stringify(params, null, 4);
        console.log(params);
    });
}

export const bind = () => {
    /*$(document).on("click", '.hire_button', (a) => {
        game.hire($(a.currentTarget).data("id"));
    })*/
	$(document).on("click", '.sell_button', (a) => {
        game.sell($(a.currentTarget).data("id"));
    })
	$(document).on("click", '.publish_button', (a) => {
        game.publish($(a.currentTarget).data("id"));
    })
	$(document).on("input", '#research_slide_control', (a) => {
  		var v = a.currentTarget.value;
  		$('#slider_background').css("padding-top",238-v);
  		$('#slider_background').css("height",v);

      var percentage = (v/238*10.0);
      var str_percentage = Math.round(percentage * 100)/100
      $('#research_money_proportion_label').text(str_percentage+"% of balance");

      game.update_research_money_percentage(a);
    })
}