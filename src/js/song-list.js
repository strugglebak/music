{
    let view = {
        el: '.songs-list-wrapper',
        template: `
            <ul class="songs-list">
            </ul>
        `,
        createSong(song) {
            let li = $(`
                <li>
                    <div class="song-header">
                        <svg class="icon" aria-hidden="true">
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
            li.find('.song-name > span').text(song.title);
            li.find('.song-author-content > span').text(song.author);
            return li;
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
        async fetch() {
            var query = new AV.Query('Song');
            try {
                const songs = await query.find();
                this.data.songs = songs.map((song) => {
                    return { id: song.id, ...song.attributes };
                });
            }
            catch (error) {
                console.log(error);
            }
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
                this.model.data.songs.push(songData);
                this.view.render(this.model.data);
            });
        },
        bindEvents() {
            this.view.$el.on('click', 'li > .song-header > svg', (e)=> {
                this.view.clearActive();
                let $currentParent = $(e.target).parent();
                if ($currentParent.hasClass('icon')) {
                    $currentParent = $currentParent.parent();
                }
                $currentParent.parent().addClass('active');
                window.eventHub.emit('selected', {});
            });
        },
        fetchAllSongs() {
            this.model.fetch().then(()=> {
                this.view.render(this.model.data);
            }, (error)=> {console(error)});
        }
    };

    controller.init(view, model);
}