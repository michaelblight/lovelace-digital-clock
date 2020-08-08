class DigitalClock extends HTMLElement {

    set hass(hass) {
        if (!this.content) {
            var config = this.config;
            const card = document.createElement('ha-card');

            const layout = config.layout || {};
            const fontSize = layout['font-size'] || '24px';
            const style = config.style;

            this.options = copy(config.options) || {};
            this.options.hours24 = this.options.hours24 || false;
            this.options.ampm = this.options.ampm || false;
            this.options.seconds = this.options.seconds || false;

            this.content = document.createElement('div');
            if (style) {
                this.content.style = style;
            } else {
                this.content.style.fontSize = fontSize;
                this.content.style.lineHeight = fontSize;
                this.content.style.fontFamily = layout['font-family'] || 'geneva';
                this.content.style.padding = layout.padding || '4px';
            }
            this.content.style.textAlign = 'center';

            card.appendChild(this.content);
            this.appendChild(card);
            this.drawClock();
            this.content.style.lineHeight = getComputedStyle(this.content).fontSize;
            var self = this;
            setInterval(function() { self.drawClock(); }, 1000);
       }
    }

    drawClock() {
        const now = new Date();
        this.content.innerHTML = formatTime(now, this.options);
    }

    setConfig(config) {
        this.config = config;
    }

    getCardSize() {
        return 3;
    }
}

customElements.define('digital-clock', DigitalClock);

function formatTime(d, options) {
    const time = new Date();
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();
    var temp = '';
    temp += (!options.hours24 && (hour > 12) ? hour - 12 : hour);
    if (hour === 0)
        temp = '12';
    temp += ((minute < 10) ? ':0' : ':') + minute;
    if (options.seconds === true)
        temp += ((second < 10) ? ':0' : ':') + second;
    if (!options.hours24 && (options.ampm === true))
        temp += (hour >= 12) ? ' PM' : ' AM';
    return temp;
}

function copy(o) {
    return (o ? JSON.parse(JSON.stringify(o)) : null);
}
