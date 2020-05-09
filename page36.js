{
	var audioContext = new AudioContext();
	var audiosource;
	var splitter = audioContext.createChannelSplitter(2);
	var merger = audioContext.createChannelMerger(2);
	var node = audioContext.createScriptProcessor(1024, 2, 2);

	// Gain Node for both channel
 	var gainL = audioContext.createGain();
	var gainR = audioContext.createGain();
	gainL.gain.value = 1.0;
	gainR.gain.value = 1.0;

	navigator.getUserMedia = ( navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia);

	function soundThrough() {
		navigator.getUserMedia({video: false, audio: true},

		function(stream){
			audiosource = audioContext.createMediaStreamSource(stream);
			audiosource.connect(node);
			node.connect(splitter);
			splitter.connect(gainL, 0);
			splitter.connect(gainR, 1);
			gainL.connect(merger, 0, 0)
			gainR.connect(merger, 0, 1)
			merger.connect(audioContext.destination);
		},

		function(e) {	// I can't use getUserMedia
			console.log(e);
		}
	);
}

{
	var ixb = 12;	//�`��X���̊�_
	var iyb = 12;	//�`��Y���̊�_
	var ixw = 1024;	//�`���X���̃T�C�Y
	var iyw = 200;	//�`���X���̃T�C�Y

	/* �`��̈�̏����� */
	var canvas = document.getElementById('waveshape');
	var waveshape = canvas.getContext('2d');
    waveshape.strokeRect(ixb,iyb,ixw,iyw);

	/* Audio Buffer ����t�ɂȂ����炱�̊֐����Ă΂�� */
	function process(data){
		var procsize = data.inputBuffer.length;
		/* L-ch ��`�悷�� */
		var inbufL = data.inputBuffer.getChannelData(0);
		var inbufR = data.inputBuffer.getChannelData(1);
		var outbufL = data.outputBuffer.getChannelData(0);
		var outbufR = data.outputBuffer.getChannelData(1);

		waveshape.beginPath();
		var ix=iy=0;

		/* �`��̈�̃N���A */
	    waveshape.clearRect(ixb,iyb,ixw,iyw);

		/* �g�`�̕\�� */
		waveshape.strokeStyle ="#000000";
		waveshape.moveTo(ixb, iyb+iyw/2);
		for(var i=0;i<procsize; i+=8){
			iy=Math.floor(inbufL[i]*100+iyw/2+iyb);
			if(iy >= iyw+iyb ) iy=iyw+iyb;
			else if(iy<=iyb ) iy=iyb;

			ix=Math.floor(i+ixb);
			waveshape.lineTo(ix, iy);
		}
		waveshape.stroke();

		for(var i=0; i<procsize; i++){ outbufL[i]=inbufL[i]; outbufR[i]=inbufR[i]; }

	}

	//�f�[�^�����֐��̒�`
	node.onaudioprocess=process;

	/* LOG�̈�̏����� */
	var log = document.getElementById("log");
	var sampleRate = audioContext.sampleRate;

	log.innerText +="sample rate:"
	log.innerText += sampleRate;
	log.innerText +="\n";

	function leftGainChange(value){
		log.innerText +="left gain:"
		log.innerText +=value;
		log.innerText +="\n";
		gainL.gain.value = value;
	}
	function RightGainChange(value){
		log.innerText +="right gain:"
		log.innerText +=value;
		log.innerText +="\n";
		gainR.gain.value = value;
	}
}
