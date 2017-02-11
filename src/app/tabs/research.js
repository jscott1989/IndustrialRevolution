import Handlebars from "handlebars"
import $ from "jQuery"
import { game } from "../main"
import vis from "Vis"

var source   = $("#completed-research-template").html()
var template = Handlebars.compile(source)

export const update = (researchCompleted) => {
    var html = _.map(researchCompleted, (research) => {
        return template(research)
    }).join("");
    $("#completed_research_table > table").html(html);

    var DIR = '/assets/';

	var nodes = null;
    var edges = [];
    var network = null;

    /*nodes = [
        {id: 1,  shape: 'circularImage', image: DIR + 'tech.jpeg'},
        {id: 2,  shape: 'circularImage', image: DIR + 'tech.jpeg'},
        {id: 3,  shape: 'circularImage', image: DIR + 'tech.jpeg'},
        {id: 4,  shape: 'circularImage', image: DIR + 'tech.jpeg', label:"pictures by this guy!"},
        {id: 5,  shape: 'circularImage', image: DIR + 'tech.jpeg'},
        {id: 6,  shape: 'circularImage', image: DIR + 'tech.jpeg'},
        {id: 7,  shape: 'circularImage', image: DIR + 'tech.jpeg'},
        {id: 8,  shape: 'circularImage', image: DIR + 'tech.jpeg'},
        {id: 9,  shape: 'circularImage', image: DIR + 'tech.jpeg'},
        {id: 10, shape: 'circularImage', image: DIR + 'tech.jpeg'},
        {id: 11, shape: 'circularImage', image: DIR + 'tech.jpeg'},
        {id: 12, shape: 'circularImage', image: DIR + 'tech.jpeg'},
        {id: 13, shape: 'circularImage', image: DIR + 'tech.jpeg'},
        {id: 14, shape: 'circularImage', image: DIR + 'tech.jpeg'},
        {id: 15, shape: 'circularImage', image: DIR + 'tech.jpeg', brokenImage: DIR + 'tech.jpeg', label:"when images\nfail\nto load"},
        {id: 16, shape: 'circularImage', image: DIR + 'tech.jpeg', brokenImage: DIR + 'tech.jpeg', label:"fallback image in action"}
      ];*/

      nodes = _.map(researchCompleted, (research) => {
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
      /*edges = _.reduce(researchCompleted, (research) => {
      	console.log(research.prerequisites)
          var stuff = _.map(research.prerequisites, (prerequisite) => {
          	  console.log(prerequisite)
              return {from: research.id, to: prerequisite}
          })
      	  return stuff
      });*/
      for(var i=0; i<researchCompleted.length; i++) {
      	var research = researchCompleted[i];
      	for(var j=0; j<research.prerequisites.length; j++) {
      		var prerequisite = research.prerequisites[j];
      		edges.push({from: research.id, to: prerequisite})
      	}
      }
      console.log(edges);

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
        	enabled: false,
        }
      };
      network = new vis.Network(container, data, options);
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
}