;(function(){
    var inputFile;

    var MsgBox = function(w, h, buttons){
        this.el = document.createElement("div");
        this.el.className = "alloyPhotoBox";

        this.el.style.width = (w || 500) + "px";
        this.el.style.height = (h || 500) + "px";

        this.el.style.marginLeft = ~~(- w / 2) + "px";
        this.el.style.marginTop = ~~(- h / 2) + "px";

        this.titleEl = document.createElement("h3");
        this.titleEl.innerHTML = "TITLE";

        this.contentEl = document.createElement("div");
        this.contentEl.className = "boxContent";

        this.buttonEl = document.createElement("div");
        this.buttonEl.className = "alloyButton";

        this.el.appendChild(this.titleEl);
        this.el.appendChild(this.contentEl);
        this.el.appendChild(this.buttonEl);

        if(buttons){
            for(var i = 0; i < buttons.length; i ++){
                var button = buttons[i];
                var id = button.id;

                var buttonEl = document.createElement("a");
                buttonEl.className = "button ";
                var spanEl = document.createElement("span");

                spanEl.innerHTML = buttons.title;

                buttonEl.className += button.type + "-button";

                this["button_" + id] = buttonEl;

                this.buttonEl.appendChild(buttonEl);
            }
        }

        document.body.appendChild(this.el);
    };

    MsgBox.prototype = {
        hide: function(){
            this.el.style.top = "-1000px";

            return this;
        },

        show: function(){
            this.el.style.top = "50%";
            return this;
        },

        title: function(title){
            this.titleEl.innerHTML = title;

            return this;
        },

        html: function(html){
            this.contentEl.innerHTML = html;

            return this;
        },

        registerEvent: function(id, func){
        }
    };

    window.$AP = {
        require: function(img, callback){
            this.getInputFileEl().openFile(callback);
        },
        getInputFileEl: function(){
            return  inputFile || function(){
                var msgBox = new MsgBox(400, 310);
                var el = document.createElement("input");
                el.type = "file";

                var fileHandler;
                el.openFile = function(callback){
                    msgBox.show().title("AlloyPhoto —— 请上传图片").html("该效果请求使用您的图片，请上传图片<br /><div class='fileWrapper'><a id='openFile' class='fileButton button'><span>上传图片</span></a></div>");

                    document.getElementById("openFile").onclick = function(e){
                        fileHandler = callback;
                        el.click();
                    };
                };

                el.onchange = function(e){
                    var file = e.target.files[0];

                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function(){
                        var tempImg = new Image();
                        tempImg.onload = function(){
                            msgBox.hide();
                            fileHandler(this);
                        };

                        tempImg.src = this.result;
                    };
                };

                document.body.appendChild(el);

                return inputFile = el;
            }();
        },

        show: function(pic){
            var wrapper = document.getElementById("showPic");
            wrapper.innerHTML = "";

            var img = new Image();
            img.src = pic.save();

            wrapper.appendChild(img);

            var download = document.getElementById("download");
            download.style.display = "block";
            download.onclick = function(){
                pic.saveFile();
            };
        }
    };
})();

