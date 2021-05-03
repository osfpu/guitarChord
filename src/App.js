import React, {
	Component
} from 'react';
import './App.css';
import ChordDraw from './component/chordDraw';

function is(data) {
	return function(type) {
		return Object.prototype.toString.call(data) === `[object ${type}]`;
	}
}

function convert(target, notes) {
	var keyMap = ['1', '#1', '2', '#2', '3', '4', '#4', '5', '#5', '6', '#6', '7']; // 音程
	var intervalMap = ['C', ['#C', 'bD'], 'D', ['#D', 'bE'], 'E', 'F', ['#F', 'bG'], 'G', ['#G', 'bA'], 'A', ['#A', 'bB'], 'B']; //所有调名
	var base = 0;

	for (var k in intervalMap) {
		if (is(intervalMap[k])('Array')) {
			if (intervalMap[k].includes(target)) {
				base = k;
				break;
			}
		} else {
			if (intervalMap[k] === target) {
				base = k;
				break;
			}
		}
	}

	var tones = []

	for (var note of notes) {
		var added = parseInt(base) + parseInt(note);
		tones.push(keyMap[added % 12]);
	}

	return tones;
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			chordTone: ['1', '5']
		}
	}
	componentDidMount() {
		var target = decodeURIComponent(window.location.pathname.substring(1));
		console.log(target);
		var chordsets = require('./chords.js').presetChords;

		for (var cs in chordsets) {
			if (cs !== 'Common') {
				for (var k in chordsets[cs]) {
					if (chordsets[cs][k]['name'] === target) {
						var chordTone = convert(cs, chordsets[cs][k]['notes']);
						console.log(chordTone);
						this.refs.chordDraw.draw(chordTone);
						return;
					}
				}
			}
		}
	}
	render() {
		return (
			<div className="App">
				<ChordDraw ref="chordDraw"/>
			</div>
		);
	}
}

export default App;