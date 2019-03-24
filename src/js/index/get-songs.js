{
    let view = {
        el: 'section.songs-play-list > ol.songs',
        template: `
            <li>
                <a href="/travis/music/src/song?id={{song.id}}">
                    <div class="song-info-wrapper">
                        <div class="song-info">
                            <div class="title">{{song.title}}</div>
                            <div class="detail">
                                <svg class="icon" aria-hidden="true"> <use xlink:href="#icon-sq"></use> </svg>
                                <div class="text">{{song.author}} - {{song.title}}</div>
                            </div>
                        </div>
                        <div class="play">
                            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-play"></use></svg>
                        </div>
                    </div>
                </a>
            </li>
        `,
        init() {
            this.$el = $(this.el);
        },
        render(data) {
            let {songs} = data;
            songs.map((song)=> {
                let $li = $(this.template
                    .replace('{{song.id}}', song.id)
                    .replace('{{song.title}}', song.title)
                    .replace('{{song.author}} - {{song.title}}', `${song.author} - ${song.title}`))
                $(this.el).append($li);
            });
        }
    };
    let model = {
        data: {
            songs: [],
        },
        fetch() {
            var query = new AV.Query('Song');
            query.limit(10);
            return query.find().then((songs)=> {
                this.data.songs = songs.map((song) => {
                    return { id: song.id, ...song.attributes };
                });
                this.data.songs.reverse();
                return songs;
            });
        }
    };
    let controller = {
        view: null,
        model: null,
        init(view, model) {
            this.view = view;
            this.view.init();
            this.model = model;

            window.eventHub.emit('loading', {});

            this.fetchAllSongs();
            this.bindEvents();
        },
        bindEvents() {},
        fetchAllSongs() {
            this.model.fetch().then(()=> {
                window.eventHub.emit('after-load', {});
                this.view.render(this.model.data);
            }, (error)=> {console(error)});
        },
    };

    controller.init(view, model);
}
