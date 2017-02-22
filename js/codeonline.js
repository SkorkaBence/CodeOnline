$(function() {
    if (location.protocol != 'https:' && location.protocol != 'file:') {
        location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
        return;
    }
    
    $("#translatedcontainer").hide();
    
    screenResize();
    reseteditor();
    
    $("#runbtn").click(function() {
        $("#resploading").show("fade");
        $("#res").val("");
        $("#translatedcontainer").hide();
        screenResize();
        csfapi.request({
            type: "code",
            language: $("#lngselect").val(),
            postdata: {
                code: $("#editor").val(),
                input: $("#inp").val()
            },
            callback: function(data) {
                $("#res").val(data.output);
                $("#resploading").hide("fade");
                if (data.translated !== undefined) {
                    showTranslated(data.translated);
                }
            }
        });
    });
    
    $("#lngselect").change(function() {
        $("#translatedcontainer").hide();
        reseteditor();
    });
    
    $(window).resize(function() {
        screenResize();
    });
    
    $("#sharebtn").click(function() {
        share();
    });
    
    $("#shareclosebtn").click(function() {
        $("#sharedialog").hide("fade");
    });
    
    $("#showhidefooter").click(function() {
        if ($("footer").hasClass("hidden")) {
            $("footer").removeClass("hidden");
            $("#showhidefooter").html("Hide");
            screenResize();
        } else {
            $("footer").addClass("hidden");
            $("#showhidefooter").html("Show");
            screenResize();
        }
    });
    
    var hash = getHash();
    if (hash != "") {
        loadShare(hash);
    }
    changeHash("");
});

window.onload = function() {
    $("#loadbox").hide("fade");
    $("#resploading").hide();
    $("#sharedialog").hide();
}

function reseteditor(refill) {
    var cnt = $("#editor").val();
    
    $("main").html("");
    var ta = document.createElement("textarea");
    ta.id = "editor";
    $("main").append(ta);
    
    if (refill === undefined) {
        fillEditor();
    } else {
        ta.value = cnt;
    }
    
    $(ta).css("height", $("main").height());

    $(ta).ace({
        theme: "chaos",
        lang: LtoL()
    });
}

function showTranslated(code) {
    $("#translatedcontainer").show();
    $("#translatedcontainer").html("");
    var ta = document.createElement("textarea");
    $("#translatedcontainer").append(ta);
    ta.value = code;
    
    $(ta).css("height", $("#translatedcontainer").height());
    $(ta).css("width", "100%");
    
    $(ta).ace({
        theme: "chaos",
        lang: "c_cpp"
    });
}

function changeHash(hash) {
	window.location.hash = hash;
	//window.history.pushState("", "", "/"+hash);
}
function getHash() {
	var pagehash = window.location.hash.substr(1);
	return pagehash;
}

function screenResize() {
    $(".io").css("width", $("#lngselect").offset().left - 15);
    if ($("footer").hasClass("hidden")) {
        $("#showhidefooter").css("bottom", 0);
        $("main").css("height", "100%");
        $("#translatedcontainer").css("height", "100%");
    } else {
        $("#showhidefooter").css("bottom", $("footer").height());
        $("main").css("height", "calc(100% - "+$("footer").height()+"px)");
        $("#translatedcontainer").css("height", "calc(100% - "+$("footer").height()+"px)");
    }
    if ($("#translatedcontainer").is(":visible")) {
        $("main").css("width", "50%");
        showTranslated($("#translatedcontainer textarea").val());
    } else {
        $("main").css("width", "100%");
    }
    reseteditor(false);
}

function LtoL() {
    if ($("#lngselect").val() == "C++")
        return "c_cpp"
    if ($("#lngselect").val() == "python" || $("#lngselect").val() == "python3.6")
        return "python";
    if ($("#lngselect").val() == "bash")
        return "sh";
    if ($("#lngselect").val() == "php")
        return "php";
    if ($("#lngselect").val() == "C#")
        return "csharp";
    if ($("#lngselect").val() == "brainfuck")
        return "python";
    if ($("#lngselect").val() == "pascal")
        return "haxe";
    if ($("#lngselect").val() == "shakespeare")
        return "";
}

function fillEditor() {
    if ($("#lngselect").val() == "C++")
        $("#editor").val("#include <iostream>\n#include <cstdlib>\n\nusing namespace std;\n\nint main(int argc, char* argv[])\n{\n    cout << \"Hello World!\";\n    return 0;\n}");
    if ($("#lngselect").val() == "python")
        $("#editor").val("print 'Hello World!'");
    if ($("#lngselect").val() == "python3.6")
        $("#editor").val("print(\"Hello World!\")");
    if ($("#lngselect").val() == "bash")
        $("#editor").val("#!/bin/bash\necho \"Hello World!\"");
    if ($("#lngselect").val() == "php")
        $("#editor").val("<?php\necho \"Hello World!\";\n?>");
    if ($("#lngselect").val() == "C#")
        $("#editor").val("using System;\nusing System.IO;\n\nnamespace Solution\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            Console.WriteLine(\"Hello World!\");\n        }\n    }\n}");
    if ($("#lngselect").val() == "brainfuck")
        $("#editor").val("++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.");
    if ($("#lngselect").val() == "pascal")
        $("#editor").val("PROGRAM Solution;\nUSES\n    sysutils;\n\nBEGIN\n    WriteLn('Hello World!');\nEND.");
    if ($("#lngselect").val() == "shakespeare")
        $("#editor").val("");
}

function share() {
    var formdata = new FormData();
    formdata.append("code", $("#editor").val());
    formdata.append("lang", $("#lngselect").val());
    formdata.append("input", $("#inp").val());
    
    $("#loadbox").show("fade");
    
    $.ajax({
        url: 'https://host.csfcloud.com/learndb/codepage.php?type=save',
        type: 'POST',
        crossDomain: true,
        data: formdata,
        success: function(data){
            $("#loadbox").hide("fade");
            $("#sharedialog").show("fade");
            $("#fixurl").val("https://code.csfcloud.com#" + data.id);
        },
        error: function(xhr, status, error){
            console.log("HTTP GET Error: " + error);
        },
        cache: false,
        contentType: false,
        processData: false
    });
}

function loadShare(id) {
    var formdata = new FormData();
    formdata.append("id", id);
    
    $.ajax({
        url: 'https://host.csfcloud.com/learndb/codepage.php?type=load',
        type: 'POST',
        crossDomain: true,
        data: formdata,
        success: function(data){
            if (data.ok) {
                $("#editor").val(data.code);
                $("#lngselect").val(data.lang);
                $("#inp").val(data.input)
                reseteditor(false);
            }
        },
        error: function(xhr, status, error){
            console.log("HTTP GET Error: " + error);
        },
        cache: false,
        contentType: false,
        processData: false
    });
}