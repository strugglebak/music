{
    let view = {
        el: 'div.page-wrapper',
        init() {
            this.$el = $(this.el);
        },
        find(selector) {
            return $(this.el).find(selector);
        }
    };
    let model = {
        data: {
            title: '', author: '', link: '', id: '',
        },
        fetchSongById(id) {
            var Song = new AV.Query('Song');
            return Song.get(id).then((songData)=> {
                let {id, attributes} = songData;
                Object.assign(this.data, {id, ...attributes});
            }, (error)=> { console.log(error); });
        }
    };
    let controller = {
        view: null,
        model: null,
        audio: null,
        init(view, model) {
            this.view = view;
            this.view.init();
            this.initView();
            this.model = model;
            this.bindEvents();
            this.initAudio();
        },
        bindEvents() {
            this.view.$el.on('click', (e)=> {
                if (this.audio.paused) {
                    this.play();
                    this.addPlayingClass();
                } else {
                    this.pause();
                    this.removePlayingClass();
                }
            });
        },
        getSongId() {
            let parsedUrl = new URL(window.location.href);
            return parsedUrl.searchParams.get('id');
        },
        initView() {
            let playButton = this.view.$el.find('section.disc-wrapper > .disc > img.play');
            $(playButton).attr('display', 'none');
        },
        initAudio() {
            this.model.data.id = this.getSongId();
            this.model.fetchSongById(this.model.data.id).then(()=> {
                this.audio = new Audio(this.model.data.link);
                this.audio.play();
                this.addPlayingClass();
            });
        },
        play() {
            this.audio.play();
        },
        pause() {
            this.audio.pause();
        },
        addPlayingClass() {
            let discWrapper = this.view.$el.find('section.disc-wrapper');
            $(discWrapper).addClass('playing');
        },
        removePlayingClass() {
            let discWrapper = this.view.$el.find('section.disc-wrapper');
            $(discWrapper).removeClass('playing');
        }
    };

    controller.init(view, model);
}