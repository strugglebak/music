{
    let view = {
        el: '.content > main .upload-area',
        template: `
            <div id="uploadDragable" class="upload-dragable">
                <span>请选择文件或将文件拖拽至此进行上传</span>
            </div>
            <div id="uploadButton" class="actions">
                <button type="submit">选择文件</button>
            </div>
        `,
        find(selector) {
            return $(this.el).find(selector)[0].id;
        },
        render(data) {
            $(this.el).html(this.template);
        },
        clearInactive() {
            $(this.el).removeClass('inactive');
        },
        init() {
            this.$el = $(this.el);
            this.clearInactive();
        }
    };
    let model = {};
    let controller = {
        view: null,
        model: null,
        init(view, model) {
            this.view = view;
            this.view.init();
            this.model = model;
            this.view.render(this.model.data);
            this.initQiniu();

            window.eventHub.on('save', (data)=> {
                this.view.clearInactive();
            });
            window.eventHub.on('selected', (data)=> {
                this.view.$el.addClass('inactive');
            });
            window.eventHub.on('new-song', ()=> {
                this.view.$el.removeClass('inactive');
            });
        },
        splitFileName(text) {
            var pattern = /\.{1}[a-z]{1,}$/;
            if (pattern.exec(text) !== null) {
                return (text.slice(0, pattern.exec(text).index));
            } else {
                return text;
            }
        },
        initQiniu() {
            var uploader = Qiniu.uploader({
                runtimes: 'html5',    //上传模式,依次退化
                browse_button: this.view.find('#uploadButton'),       //上传选择的点选按钮，**必需**
                uptoken_url: 'http://localhost:8888/uptoken',
                domain: 'http://pma54ymw2.bkt.clouddn.com',   //bucket 域名，下载资源时用到，**必需**
                get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的 token
                max_file_size: '40mb',           //最大文件体积限制
                dragdrop: true,                   //开启可拖曳上传
                drop_element: this.view.find('#uploadDragable'),        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': (up, files)=> {
                        plupload.each(files, function (file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    'BeforeUpload': (up, file)=> {
                        // 每个文件上传前,处理相关的事情
                    },
                    'UploadProgress': (up, file)=> {
                        // 每个文件上传时,处理相关的事情
                        console.log('上传中...')
                        
                    },
                    'FileUploaded': (up, file, info)=> {
                        console.log('上传完毕!')
                        // 每个文件上传成功后,处理相关的事情
                        // 其中 info.response 是文件上传成功后，服务端返回的 json，形式如
                        // {
                        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //    "key": "gogopher.jpg"
                        //  }
                        // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                        var domain = up.getOption('domain');
                        var res = JSON.parse(info.response);
                        var sourceLink = domain + '/' + encodeURIComponent(res.key); // 获取上传成功后的文件的Url
                        var sourceTitle = this.splitFileName(res.key);
                        window.eventHub.emit('upload', {
                            link: sourceLink,
                            title: sourceTitle
                        });
                        this.view.$el.addClass('inactive');
                    },
                    'Error': (up, err, errTip)=> {
                        //上传出错时,处理相关的事情
                    },
                    'UploadComplete': ()=> {
                        //队列文件处理完毕后,处理相关的事情
                    },
                }
            });
        },
    };

    controller.init(view, model);
}