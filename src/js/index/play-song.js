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
            this.model = model;
            this.bindEvents();
            this.initAudio();
        },
        bindEvents() {
            this.view.$el.on('click', (e)=> {
                if (this.audio.paused) {
                    this.play();
                    this.addStartClass();
                } else {
                    this.pause();
                    this.addPauseClass();
                }
            });
        },
        getSongId() {
            let parsedUrl = new URL(window.location.href);
            return parsedUrl.searchParams.get('id');
        },
        initAudio() {
            this.model.data.id = this.getSongId();
            this.model.fetchSongById(this.model.data.id).then(()=> {
                this.audio = new Audio(this.model.data.link);
                this.audio.play();
                this.addStartClass();
            });
        },
        play() {
            this.audio.play();
        },
        pause() {
            this.audio.pause();
        },
        addStartClass() {
            let playButton = this.view.$el.find('section.disc-wrapper .disc > img.play');
            $(playButton).removeClass('pause').addClass('start');
        },
        addPauseClass() {
            let playButton = this.view.$el.find('section.disc-wrapper .disc > img.play');
            $(playButton).removeClass('start').addClass('pause');
        }
    };

    controller.init(view, model);
}