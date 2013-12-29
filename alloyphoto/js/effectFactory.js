;(function(){
    var editor;
    var EffectFactory = {
        init: function(){
            this.View.init();
            this.Event.init();

            this.View.formatCode();
        }
    };

    var runtimePanelEl;
    EffectFactory.View = {
        init: function(){
            this.getRuntimePanel();
            this.renderEffectList();
        },

        formatCode: function(){
            editor = ace.edit("souceCode");
            editor.setTheme("ace/theme/tomorrow_night_eighties");
            editor.getSession().setMode("ace/mode/javascript");
        },

        renderEffectList: function(){
            var html = "";
            for(var i = 0; i < EffectsList.length; i ++){
                var item = EffectsList[i];
                var name = item[1];
                var cnname = item[0];
                var author = item[2];
                var date = item[3];
                html += EffectTmp.replace(/{name}/g, name).replace(/{cnname}/g, cnname).replace(/{author}/g, author).replace(/{date}/g, date);
            }

            $(".effectsFactory").html(html);
        },
        getRuntimePanel: function(){
            return runtimePanelEl || function(){
                var runtimePanel = $(".runtimePanel");
                var el = {
                    close: function(){
                        runtimePanel.css("top", - runtimePanel.height() + "px");

                        return this;
                    },
                    show: function(){
                        runtimePanel.css("top", "20px");

                        return this;
                    },
                    title: function(title){
                        $(".runtimePanel .title").html(title);

                        return this;
                    },

                    init: function(effectName){
                        $("#showPic").html("");
                        $(".oper").show();
                        $("#download").hide();
                        this.title(effectName);

                        $.ajax({
                            url: "effects/" + effectName + ".js?" + new Date,
                            method: "GET",
                            success: function(res){
                                editor && editor.setValue(res);
                            }
                        });
                    }

                };

                var width = $("body").width() - 100;
                var height = $("body").height() - 40;
                runtimePanel.css({"margin-left": - width / 2 + "px", "top": - height + "px", "width": width + "px", "height": height});

                var h = height - $(".runtimePanel .title").height() - 10 + "px";
                $(".runtimeWrapper").css({"height": h, "line-height": h});

                $(".close").click(function(){
                    el.close();
                });

                $(".closeSource").click(function(){
                    var right =  $(".source").width() + "px";
                    $(".source").css("transform", "translate(" + right + ", 0)");
                    $(".source").css("-webkit-transform", "translate(" + right + ", 0)");
                });

                $("#checkCode").click(function(){
                    var right = 0;
                    $(".source").css("transform", "translate(" + right + ", 0)");
                    $(".source").css("-webkit-transform", "translate(" + right + ", 0)");
                });

                runtimePanelEl = el;
                return el;
            }();
        }
    };

    EffectFactory.Model = {
    };

    EffectFactory.Event = {
        init: function(){
            var _this = EffectFactory;

            $(".effectsFactory li").live("click", function(e){
                var name = $(this).attr("data-ename");
                _this.View.getRuntimePanel().show().init(name);

                e.preventDefault();
                e.stopPropagation();
            });

            $(".runCode").click(function(e){
                var sourceCode;
                editor && (sourceCode = editor.getValue());
                try{
                    eval(sourceCode);
                    $(".oper").hide();
                }catch(e){
                }
            });
        }
    };

    $(function(){
        EffectFactory.init();
    });
})();
