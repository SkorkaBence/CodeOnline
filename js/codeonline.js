$(function() {
    if (location.protocol != 'https:' && location.protocol != 'file:') {
        location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
        return;
    }
    
    screenResize();
    reseteditor();
    
    $("#runbtn").click(function() {
        $("#res").val("");
        csfapi.request({
            type: "code",
            language: $("#lngselect").val(),
            postdata: {
                code: $("#editor").val(),
                input: $("#inp").val()
            },
            callback: function(data) {
                $("#res").val(data.output);
            }
        });
    });
    
    $("#lngselect").change(function() {
        reseteditor();
    });
    
    $(window).resize(function() {
        screenResize();
    });
});

window.onload = function() {
    $("#loadbox").hide("fade");
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
    
    window.setTimeout(function() {
        $(ta).css("height", $("main").height());

        $(ta).ace({
            theme: "chaos",
            lang: LtoL()
        });
    }, 1);
}

function screenResize() {
    $(".io").css("width", $("#lngselect").offset().left - 15);
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
}