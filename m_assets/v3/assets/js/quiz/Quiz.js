class Quiz {
    questions = [
        {
            text: "你能来这里真是太好了！这让胡桃很高兴。不如我们来玩个小游戏吧。需要你任意想一个从0到1000的数字，让胡桃来猜猜你心中所想的数字，好吗？",
            img: "m_stickers/en/Menhera-chan.3/8.png",
            voice: "question/1.mp3"
        },
        {
            text: "哦！你来得正好！胡桃最近学习了读心术，我要你在0到1000之间想一个数字，好吗？",
            img: "m_stickers/en/Menhera-chan.3/8.png",
            voice: "question/1.mp3"
        },  
        {
            text: "你愿意和我一起玩吗？嗯呐，所以我想让你想一个在0到1000之间的一个数字，然后我试着猜一下。",
            img: "m_stickers/en/Menhera-chan.3/8.png",
            voice: "question/1.mp3"
        },
        {
            text: "诶嘿嘿嘿，那么你就和我一起玩一会儿吧。那么就请你想一个从0到1000的数字，胡桃会尽力去猜的!",
            img: "m_stickers/en/Menhera-chan.3/6.png",
            voice: "question/2.mp3"
        },
        {
            text: "胡桃已经学习了一整天的读心术，现在就来试试看学习成果吧！。你来想一个从0到1000的数字，我会问你一些问题，猜出你想的数字。",
            img: "m_stickers/en/Menhera-chan.6/13.png",
            voice: "question/3.mp3"
        },
        {
            text: "你是不是在想“我想要什么”对吗？不过现在我们<b>只</b>玩一个小游戏，好吗？想一个从0到1000的数字，只要问几个问题，我就会告诉你，你想到的是哪个数字。",
            img: "m_stickers/en/Menhera-chan.6/23.png",
            voice: "question/4.mp3"
        },
        {
            text: "你想和胡桃玩一个小游戏吗？ 我需要你想一个从0到1000的数字，然后我将尝试猜测你想到的是哪一个，好吗？",
            img: "m_stickers/en/Menhera-chan.3/36.png",
            voice: "question/5.mp3"
        }
    ]

    right = [
        {
            text: "嘿嘿，被我猜中了吧。要不要再玩一次？",
            img: "m_stickers/en/Menhera-chan.3/8.png",
            voice: "right/1.mp3"
        },
        {
            text: "我很高兴我赢了！我们可以再玩一次吗？",
            img: "m_stickers/en/Menhera-chan.3/26.png",
            voice: "right/1.mp3"
        },
        {
            text: "胡桃猜对了呢。我还以为不会猜中，不过还是猜到了！我们可以再玩一次吗？",
            img: "m_stickers/en/Menhera-chan.2/31.png",
            voice: "right/2.mp3"
        },
        {
            text: "好了好了……我成功地猜出了你所想的数字，想看看我用了什么方法吗？",
            img: './m_stickers/en/Menhera-chan/22.png',
            voice: "right/3.mp3"
        },
        {
            text: "我真是太厉害了! 让我们再玩一次，看看这是不是我运气好。",
            img: "m_stickers/en/Menhera-chan.2/6.png",
            voice: "right/4.mp3"
        }
    ]

    wrong = [
        {
            text: "哎？！不对吗？再给我一次机会，下次胡桃一定猜中！",
            img: "m_stickers/en/Menhera-chan.3/19.png",
            voice: "wrong/1.mp3"
        },
        {
            text: "啊？你在跟我开玩笑吗？！再给我一次机会，下次我一定能猜中！",
            img: "m_stickers/en/Menhera-chan.2/23.png",
            voice: "wrong/1.mp3"
        },
        {
            text: "咦？怎么回事？居然没有猜中，难道读心术不灵了吗……",
            img: "m_stickers/en/Menhera-chan/32.png",
            voice: "wrong/2.mp3"
        },
        {
            text: "我真的，真的很抱歉。我彻底失望了！我可以最后再试一次吗？",
            img: "m_stickers/en/Menhera-chan/12.png",
            voice: "wrong/3.mp3"
        },
        {
            text: "哎呀，这次没猜对。不过没关系，下次胡桃一定能猜中你想的数字。",
            img: "m_stickers/en/Menhera-chan/7.png",
            voice: "wrong/4.mp3"
        },
        {
            text: "谁知道我会犯错呢？但好吧好吧...我们再来一次？",
            img: "m_stickers/en/Menhera-chan.2/8.png",
            voice: "wrong/4.mp3"
        },
        {
            text: "唉，我从来没有想过我会弄错！嗯...让我们再来一次，好吗？",
            img: "m_stickers/en/Menhera-chan/7.png",
            voice: "wrong/4.mp3"
        }
    ]

    asking = [
        "m_stickers/en/Menhera-chan/25.png",
        "m_stickers/en/Menhera-chan/30.png",
        "m_stickers/en/Menhera-chan.2/8.png",
        "m_stickers/en/Menhera-chan/38.png"
    ]

    constructor() {
        this.currentAsking = 0;
    }

    getAsking() {
        const imagePath = this.asking[this.currentAsking];
        this.currentAsking++;
        if (this.currentAsking === this.asking.length) {
            this.currentAsking = 0;
        }
        return imagePath;
    }

    getQuestions() {
        return this.questions;
    }

    getRightMessages() {
        return this.right;
    }

    getWrongMessages(){
        return this.wrong;
    }
}