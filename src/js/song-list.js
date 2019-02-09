{
    let view = {
        el: '.songs-list-wrapper',
        template: `
            <ul class="songs-list">
            </ul>
        `,
        createSong(song) {
            let $li = $(`
                <li>
                    <div class="song-header">
                        <svg class="icon" aria-hidden="true" data-song-id="">
                            <use xlink:href="#icon-song"></use>
                        </svg>
                    </div>
                    <div class="song-content">
                        <div class="song-name">
                            <span></span>
                        </div>
                        <div class="song-author">
                            <div class="song-author-header">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-author"></use>
                                </svg>
                            </div>
                            <div class="song-author-content">
                                <span></span>
                            </div>
                        </div>
                    </div>
                </li>
            `);
            $li.find('.song-name > span').text(song.title);
            $li.find('.song-author-content > span').text(song.author);
            $li.find('.song-header .icon').attr('data-song-id', song.id);
            return $li;
        },
        render(data) {
            let $el = $(this.el);
            $el.html(this.template);
            let {songs} = data;
            let liList = songs.map((song)=> this.createSong(song));
            $el.find('ul').empty();
            liList.map((liDom)=> {
                $el.find('ul').append(liDom);
            });
            let $ul = $el.find('ul');
        },
        clearActive() {
            $(this.el).find('.active').removeClass('active');
        },
        init() {
            this.$el = $(this.el);
        }
    };
    let model = {
        data: {
            songs: [],
        },
        fetch() {
            var query = new AV.Query('Song');
            return query.find().then((songs)=> {
                this.data.songs = songs.map((song) => {
                    return { id: song.id, ...song.attributes };
                });
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
            this.view.render(this.model.data);
            this.bindEvents();
            this.fetchAllSongs();

            window.eventHub.on('save', (songData)=> {
                this.model.data.songs.unshift(songData);
                this.view.render(this.model.data);
                this.view.clearActive();
                this.active(songData.id);   
            });
            window.eventHub.on('update', (songData)=> {
                let songs = this.model.data.songs;
                for (let i=0; i<songs.length; i++) {
                    if (songs[i].id === songData.id) {
                        songs[i] = songData;
                        break;
                    }
                }
                this.view.render(this.model.data);
            });
        },
        bindEvents() {
            this.view.$el.on('click', 'li > .song-header > svg', (e)=> {
                this.view.clearActive();
                let $currentParent = $(e.currentTarget).parent();
                if ($currentParent.hasClass('icon')) {
                    $currentParent = $currentParent.parent();
                }
                $currentParent.parent().addClass('active');
                let songId = e.currentTarget.getAttribute('data-song-id');
                let songs = this.model.data.songs;
                let dataCopy;
                for (let i=0; i<songs.length; i++) {
                    if (songs[i].id === songId) {
                        dataCopy = JSON.parse(JSON.stringify(songs[i]));
                        break;
                    }
                }
                window.eventHub.emit('selected', dataCopy);
            });
        },
        fetchAllSongs() {
            this.model.fetch().then(()=> {
                this.view.render(this.model.data);
            }, (error)=> {console(error)});
        },
        active(id) {
            this.view.$el.find(`svg[data-song-id=${id}]`).parent().parent().addClass('active');
        }
    };

    controller.init(view, model);
}