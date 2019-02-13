{
    let view = {
        el: 'section.song',
        template: `
            <div class="song-detail">
                <h2>
                    <span class="song-title">{{song.title}}</span>
                    <span class="song-gap">-</span>
                    <span class="song-author">{{song.author}}</span>
                </h2>
            </div>
        `,
        render(data) {
            let {song} = data;
            let {lyric} = song;
            lyric.split('\n').map((string)=> {
                let p = document.createElement('p');
                let regex = /\[([\d:.]+)\](.+)/;
                let matches = string.match(regex);
                if (matches) {
                    p.textContent = matches[2];
                    let time = matches[1];
                    let parts = time.split(':');
                    let minutes = parts[0];
                    let seconds = parts[1];
                    let newTime = parseInt(minutes, 10)*60 + parseFloat(seconds, 10);
                    p.setAttribute('data-time', newTime);
                } else {
                    p.textContent = string;
                }
                $(this.el).children().children().append(p);
            });
        },
        findCurtimePElement(allP, time) {
            let p;
            for (let i=0; i<allP.length; i++) {
                if (i === allP.length - 1) {
                    p = allP[i];
                    break;
                } else {
                    let currentTime = allP.eq(i).attr('data-time');
                    let nextTime = allP.eq(i+1).attr('data-time');
                    if (time >= currentTime && time < nextTime) {
                        p = allP[i];
                        break;
                    }
                }
            }
            return p;
        },
        showLyric(time) {
            let allP = $(this.el).children().children().children();
            let p = this.findCurtimePElement(allP, time);
            let pHeight = p.getBoundingClientRect().top;
            let lines = $(this.el).children().children();
            let linesHeight = lines[0].getBoundingClientRect().top;
            let height = pHeight - linesHeight;
            lines.css({
                transform: `translateY(${-(height)}px)`
            });
        }
    };
    let model = {
        data: {
            song: {
                title: '', author: '', link: '', lyric: '', id: '',
            }
        },
    };
    let controller = {
        view: null,
        model: null,
        audio: null,
        init(view, model) {
            this.view = view;
            this.model = model;
            this.bindEvents();
            this.bindEventHubs();
        },
        bindEvents() {

        },
        bindEventHubs() {
            window.eventHub.on('xxx', (data)=> {
                let {songData, audio} = data;
                Object.assign(this.model.data.song, songData);
                this.view.render(this.model.data);
                // console.log(audio)
                this.audio = audio;
                this.audio.ontimeupdate = ()=> {
                    this.view.showLyric(this.audio.currentTime);
                }
            });
        }
    };

    controller.init(view, model);
}