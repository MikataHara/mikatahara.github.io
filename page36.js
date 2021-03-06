﻿
var fdgL=null;
var fdgR=null;
var log=null;
var mMicon=0;

// constraints
var mConstraints = {
	video: false,
	audio: { echoCancellation: false }  // エコーキャンセラ無効化
};

// constraints (Chrome)
if (window.chrome) {
	mConstraints = {
		video: false,
		audio: {mandatory: {echoCancellation : false, googEchoCancellation: false}}  
	};
}

window.onload = function() {
    fdgL = new DrawGraph(0,1024,0,120);
	fdgL.fSetCanvas(document.getElementById("waveshapeL"));
//    fdgL.fResizeX();
	fdgL.cv.width = window.innerWidth;
    var w0=fdgL.cv.width;
	var wh=Math.floor(w0*0.8);
	var ws=Math.floor(w0*0.1);
    fdgL.fSetWindowXY(ws,wh,0,120);
//   fdgL.fStrokeRect();
	fdgL.fSetViewPort(0,127,-1,1);

    fdgR = new DrawGraph(0,1024,0,120);
	fdgR.fSetCanvas(document.getElementById("waveshapeR"));
//   fdgR.fResizeX();
	fdgR.cv.width = window.innerWidth;
    fdgR.fSetWindowXY(ws,wh,0,120);
//   fdgR.fStrokeRect();
	fdgR.fSetViewPort(0,127,-1,1);

	$('#mic_on').click(function(){
		if(mMicon==0){
			startAudioContext();
			$(this).val("STOP");
			mMicon=1;
		} else {
			$(this).val("MIC ON");
			mMicon=0;
		}
	});

	$('#lgain').change(function(){
		var val = $(this).val();
		if(gainL!=null) gainL.gain.value = val;
	});
	$('#rgain').change(function(){
		var val = $(this).val();
		if(gainR!=null) gainR.gain.value = val;
	});

	$('#filcut').change(function(){
		var val = $(this).val();
		if(filter!=null) filter.frequency.value = val;
	});

	log = document.getElementById("log");
};

var audioContext	= null;
var audiosource		= null;
var splitter  	= null;
var merger 		= null;
var node 		= null
var gainL	= null;
var gainR	= null;
var filter	= null;
var mCh		= 0;

function startAudioContext()
{
	if(audioContext!=null) return;

	audioContext	= new AudioContext();
	splitter		= audioContext.createChannelSplitter(2);
	merger			= audioContext.createChannelMerger(2);
	node			= audioContext.createScriptProcessor(1024, 2, 2);

	gainL = audioContext.createGain();
	gainR = audioContext.createGain();
	gainL.gain.value = 0.1;
	gainR.gain.value = 0.1;
	$('#lgain').val(Math.floor(gainL.gain.value*10)*0.1);
	$('#rgain').val(Math.floor(gainR.gain.value*10)*0.1);

	filter	= audioContext.createBiquadFilter();
	filter.type = 'lowpass';		 // Low-pass filter. See BiquadFilterNode docs
	filter.frequency.value = 440;		// Set cutoff to 440 HZ

	/* LOG領域の初期化 */
	var sampleRate = audioContext.sampleRate;
	log.innerText +="sample rate:"
	log.innerText += sampleRate;
	log.innerText +="\n";

	navigator.getUserMedia(

		mConstraints,

		function(stream){
			audiosource = audioContext.createMediaStreamSource(stream);
			audiosource.connect(filter);
			filter.connect(splitter);
			splitter.connect(gainL, 0);
			splitter.connect(gainR, 1);
			gainL.connect(merger, 0, 0)
			gainR.connect(merger, 0, 1)
			merger.connect(node);
			node.connect(audioContext.destination);
			//データ処理関数の定義
			node.onaudioprocess=process;
	},
	function(e) {	// I can't use getUserMedia
			console.log(e);
		}
	);
}

/* Audio Buffer が一杯になったらこの関数が呼ばれる */
function process(data){
	var procsize = data.inputBuffer.length;
	/* L-ch を描画する */
	var inbufL = data.inputBuffer.getChannelData(0);
	var inbufR = data.inputBuffer.getChannelData(1);
	var outbufL = data.outputBuffer.getChannelData(0);
	var outbufR = data.outputBuffer.getChannelData(1);

	if(mMicon==1){
		if(mCh==0){
			fdgL.fClearWindowAll();
			fdgL.fDrawLine(inbufL);
			mCh=1;
		} else {
			fdgR.fClearWindowAll();
			fdgR.fDrawLine(inbufR);
			mCh=0;
		}
	}

	for(var i=0; i<procsize; i++){
		outbufL[i]=inbufL[i];
		outbufR[i]=inbufR[i];
	}
}

