//-- 	------------------------------------------------------------------	-->
// �I�������e�L�X�g�t�@�C���̓��e��\��
window.addEventListener("load", function(){
	// ����\������̈�̗v�f
	var ele = document.getElementById("log");
	// �i���󋵂�\������v���O���X�o�[�̗v�f�����
	var prog = document.getElementById("loadstatus");
	// �t�@�C����ǂݍ��ނ��߂�File Reader�I�u�W�F�N�g������ϐ�
	var reader;
	// File API���g���邩���ׂ�
	if (!window.File){
		ele.innerHTML = "File API���g�p�ł��܂���";
		return;
	}

	// �u�ۑ�����v�{�^�����N���b�N���ꂽ���̏���
	document.getElementById("read").addEventListener("click", function(){
		var textFile = document.getElementById("filedata").files[0];
		// �I�����ꂽ�t�@�C�����
		ele.innerText = "�t�@�C�����F\n";
		ele.innerText += textFile.name;
		ele.innerText += "\n";
		ele.innerText += "�t�@�C���T�C�Y�F";
		ele.innerText += textFile.size;
		ele.innerText += " �o�C�g\n";
		ele.innerText += "MIME Type�F";
		ele.innerText += textFile.type;
		ele.innerText += "\n";
		ele.innerText += "---------------\n";

		// �e�L�X�g���ǂ������ׂ�
		if (textFile.type.indexOf("text/") != 0){
			ele.innerText += "�I�������t�@�C���̓e�L�X�g�`���ł͂���܂���\n";
			return;
		}
		// �e�L�X�g�t�@�C���Ȃ珈�����s��
		reader = new FileReader();
		reader.onload = function(evt){
			var text = evt.target.result;
			exectext(text);
			var text = text.substr(0, 100);	// �擪100���������\��
			ele.textContent += text;
			
		}
		reader.onerror = function(evt){
			var errorNo = evt.target.error.code
			ele.innerText += "�G���[�����F"+errorNo;
		}
		reader.onabort = function(evt){
			ele.innerText += "�ǂݍ��݂����f����܂���\n";
		}
		reader.onprogress = function(evt){
//			var loadData = evt.loaded;
//			var totalData = evt.total;
//			var per = (loadData/totalData) * 100;
//			per = per.toFixed(1);	// �����_���ʂ܂ł̕\���ɂ���
//			prog.innerHTML = per+"% ("+loadData+"/"+totalData+" �o�C�g)";
//			prog.value = per;
		}
		reader.readAsText(textFile, "utf-8");
	}, true);

}, true);

function readfile(textFile)
{
	// �e�L�X�g���ǂ������ׂ�
	if (textFile.type.indexOf("text/") != 0){
		console.log("�I�������t�@�C���̓e�L�X�g�`���ł͂���܂���");
		return;
	}
	var reader = new FileReader();
	reader.onload = function(evt){
		var text = evt.target.result;
		exectext(text);
	}
	reader.onerror = function(evt){
		var errorNo = evt.target.error.code
		console.log("�G���[�����F"+errorNo);
	}
	reader.onabort = function(evt){
		console.log("�ǂݍ��݂����f����܂���");
	}
	reader.onprogress = function(evt){
	}
	reader.readAsText(textFile, "utf-8");
}

//-- 	------------------------------------------------------------------	-->

	function download(blob, filename) {
		var objectURL = (window.URL || window.webkitURL).createObjectURL(blob),

// createElement�͂��̖��O�̒ʂ�A�G�������g(�I�u�W�F�N�g)�𐶐����܂��B
// �����ł̃G�������g�Ƃ����̂́AHTML�̃^�O�̂��Ƃł�
		a = document.createElement('a');

// a�v�f��download�����Ƀt�@�C������ݒ�
		a.download = filename;
		a.href = objectURL;

// �w�肳�ꂽ�^�C�v�� �C�x���g ���쐬���܂��B�Ԃ����I�u�W�F�N�g�͏��߂ɏ���
// ������K�v������A���̌�� element.dispatchEvent �֓n�����Ƃ��ł��܂��B
		e = document.createEvent('MouseEvent');

// click�C�x���g�𒅉�
// event.initMouseEvent(type, canBubble, cancelable, view,
//                      detail, screenX, screenY, clientX, clientY,
//                      ctrlKey, altKey, shiftKey, metaKey,
//                      button, relatedTarget);

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/initMouseEvent

		e.initEvent("click", true, true, window,
				1, 0, 0, 0, 0,
				false, false, false, false,
				0, null);

	a.dispatchEvent(e);
	}

function exportfile(){
	var fn=document.getElementById("file_name");
	var fname=fn.value;
	var dc=document.getElementById("doc_ment");
	var aaa=new Blob([dc.value]);
	download(aaa, fname);
}

/* �ǂݍ���text�̏����́A���̊֐��Ɠ������O�̊֐���html�̍Ō�ɏ���*/

function exectext(text){
//	console.log(text);
}
