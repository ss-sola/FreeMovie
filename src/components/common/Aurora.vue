<template>
    <div>
        <div class="g-wrap">
            <div class="g-aurora"></div>
        </div>

        <svg width="0" height="0" style="position:absolute;">
            <defs>
                <filter id='wave' x='0' y='0'>
                    <feTurbulence baseFrequency='0.00510 0.01099' id='turbulence' numOctaves='3' result='noise' seed='10' />
                    <feDisplacementMap in2='noise' in='SourceGraphic' scale='96' xChannelSelector='R'
                        yChannelSelector='G' />
                </filter>
            </defs>
        </svg>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {


    var filter = document.querySelector("#turbulence");
    var frames = 0;
    var rad = Math.PI / 180;

    function freqAnimation() {
        var bfx = 0.005;
        var bfy = 0.005;
        frames += .5
        bfx += 0.0025 * Math.cos(frames * rad);
        bfy += 0.0025 * Math.sin(frames * rad);

        var bf = bfx.toString() + ' ' + bfy.toString();
        filter?.setAttributeNS(null, 'baseFrequency', bf);
        window.requestAnimationFrame(freqAnimation);
    }

    window.requestAnimationFrame(freqAnimation);

})

</script>

<style scoped>
.g-wrap {
    position: relative;
    margin: auto;
    width: 100%;
    height: 100%;
    background: #0b1a3a;
    overflow: hidden;
}

.g-wrap::before {
    content: "";
    position: absolute;
    width: 1px;
    height: 1px;
    border-radius: 50%;
    /* animation: twinkle 2s infinite; */
    box-shadow: 0 0 0 0 #fff, 233px 300px 0 0.1px rgba(255, 255, 255, 1), 34px 114px 0 0.2px rgba(255, 255, 255, 1), 113px 499px 0 0.5px rgba(255, 255, 255, 1), 89px 498px 0 0.6px rgba(255, 255, 255, 1), 348px 329px 0 0.1px rgba(255, 255, 255, 1), 316px 45px 0 0.2px rgba(255, 255, 255, 1), 344px 4px 0 0.2px rgba(255, 255, 255, 1), 343px 238px 0 0.6px rgba(255, 255, 255, 1), 136px 128px 0 0.6px rgba(255, 255, 255, 1), 192px 353px 0 0.4px rgba(255, 255, 255, 1), 182px 135px 0 0.3px rgba(255, 255, 255, 1), 237px 215px 0 0.1px rgba(255, 255, 255, 1), 52px 396px 0 0.5px rgba(255, 255, 255, 1), 141px 203px 0 0.1px rgba(255, 255, 255, 1), 316px 187px 0 0.4px rgba(255, 255, 255, 1), 60px 254px 0 0.4px rgba(255, 255, 255, 1), 86px 237px 0 0.2px rgba(255, 255, 255, 1), 154px 363px 0 0.5px rgba(255, 255, 255, 1), 152px 294px 0 0.3px rgba(255, 255, 255, 1), 196px 305px 0 0.3px rgba(255, 255, 255, 1), 194px 63px 0 0.2px rgba(255, 255, 255, 1), 191px 179px 0 0.5px rgba(255, 255, 255, 1), 195px 170px 0 0.6px rgba(255, 255, 255, 1), 267px 399px 0 0.2px rgba(255, 255, 255, 1), 298px 236px 0 0.6px rgba(255, 255, 255, 1), 115px 66px 0 0.5px rgba(255, 255, 255, 1), 346px 123px 0 0.4px rgba(255, 255, 255, 1), 321px 5px 0 0.5px rgba(255, 255, 255, 1), 109px 99px 0 0.1px rgba(255, 255, 255, 1), 329px 418px 0 0.5px rgba(255, 255, 255, 1), 88px 2px 0 0.6px rgba(255, 255, 255, 1), 186px 445px 0 0.4px rgba(255, 255, 255, 1), 254px 21px 0 0.6px rgba(255, 255, 255, 1), 76px 254px 0 0.3px rgba(255, 255, 255, 1), 26px 238px 0 0.2px rgba(255, 255, 255, 1), 291px 315px 0 0.2px rgba(255, 255, 255, 1), 90px 65px 0 0.3px rgba(255, 255, 255, 1), 188px 54px 0 0.3px rgba(255, 255, 255, 1), 271px 219px 0 0.5px rgba(255, 255, 255, 1), 226px 402px 0 0.1px rgba(255, 255, 255, 1), 305px 479px 0 0.5px rgba(255, 255, 255, 1), 157px 10px 0 0.1px rgba(255, 255, 255, 1), 224px 247px 0 0.6px rgba(255, 255, 255, 1), 200px 494px 0 0.1px rgba(255, 255, 255, 1), 102px 337px 0 0.1px rgba(255, 255, 255, 1), 177px 230px 0 0.4px rgba(255, 255, 255, 1), 38px 260px 0 0.6px rgba(255, 255, 255, 1), 99px 160px 0 0.3px rgba(255, 255, 255, 1), 134px 119px 0 0.3px rgba(255, 255, 255, 1), 134px 214px 0 0.1px rgba(255, 255, 255, 1), 249px 76px 0 0.6px rgba(255, 255, 255, 1), 73px 329px 0 0.1px rgba(255, 255, 255, 1), 21px 279px 0 0.6px rgba(255, 255, 255, 1), 191px 449px 0 0.3px rgba(255, 255, 255, 1), 176px 18px 0 0.4px rgba(255, 255, 255, 1), 271px 290px 0 0.1px rgba(255, 255, 255, 1), 50px 251px 0 0.2px rgba(255, 255, 255, 1), 310px 322px 0 0.4px rgba(255, 255, 255, 1), 23px 319px 0 0.4px rgba(255, 255, 255, 1), 16px 51px 0 0.2px rgba(255, 255, 255, 1), 166px 135px 0 0.6px rgba(255, 255, 255, 1), 15px 267px 0 0.3px rgba(255, 255, 255, 1), 185px 238px 0 0.3px rgba(255, 255, 255, 1), 21px 173px 0 0.2px rgba(255, 255, 255, 1), 265px 238px 0 0.4px rgba(255, 255, 255, 1), 325px 115px 0 0.1px rgba(255, 255, 255, 1), 202px 139px 0 0.4px rgba(255, 255, 255, 1), 277px 124px 0 0.4px rgba(255, 255, 255, 1), 232px 45px 0 0.4px rgba(255, 255, 255, 1), 201px 436px 0 0.6px rgba(255, 255, 255, 1), 90px 48px 0 0.6px rgba(255, 255, 255, 1), 36px 84px 0 0.2px rgba(255, 255, 255, 1), 74px 165px 0 0.6px rgba(255, 255, 255, 1), 46px 273px 0 0.3px rgba(255, 255, 255, 1), 29px 374px 0 0.2px rgba(255, 255, 255, 1), 57px 38px 0 0.6px rgba(255, 255, 255, 1), 59px 223px 0 0.1px rgba(255, 255, 255, 1), 121px 80px 0 0.2px rgba(255, 255, 255, 1), 342px 221px 0 0.5px rgba(255, 255, 255, 1), 70px 69px 0 0.1px rgba(255, 255, 255, 1), 314px 327px 0 0.4px rgba(255, 255, 255, 1), 311px 213px 0 0.3px rgba(255, 255, 255, 1), 292px 443px 0 0.6px rgba(255, 255, 255, 1), 5px 148px 0 0.6px rgba(255, 255, 255, 1), 287px 318px 0 0.1px rgba(255, 255, 255, 1), 250px 38px 0 0.1px rgba(255, 255, 255, 1), 279px 385px 0 0.4px rgba(255, 255, 255, 1), 233px 248px 0 0.4px rgba(255, 255, 255, 1), 232px 468px 0 0.5px rgba(255, 255, 255, 1), 52px 189px 0 0.1px rgba(255, 255, 255, 1), 83px 21px 0 0.3px rgba(255, 255, 255, 1), 265px 4px 0 0.5px rgba(255, 255, 255, 1), 337px 295px 0 0.5px rgba(255, 255, 255, 1), 65px 245px 0 0.2px rgba(255, 255, 255, 1), 78px 332px 0 0.6px rgba(255, 255, 255, 1), 124px 277px 0 0.3px rgba(255, 255, 255, 1), 137px 409px 0 0.2px rgba(255, 255, 255, 1), 327px 217px 0 0.2px rgba(255, 255, 255, 1), 300px 311px 0 0.3px rgba(255, 255, 255, 1), 170px 83px 0 0.2px rgba(255, 255, 255, 1), 63px 204px 0 0.3px rgba(255, 255, 255, 1);
}

@keyframes twinkle {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.g-aurora {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
}

.g-aurora::before {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    width: 400px;
    height: 300px;
    background: #fff;
    background: radial-gradient(circle at 100% 100%, transparent 45%, #bd63c1 55%, #53e5a6 65%, transparent 85%);
    box-shadow: inset 0px 0 30px 0 #0b1a3a;
    filter: url(#wave);
    mix-blend-mode: color-dodge;
    transform: rotate(45deg) scaleX(1.4);
}

@keyframes bmove {
    from {
        transform: translateZ(10px) translateY(0);
    }

    to {
        transform: translateZ(10px) translateY(-80px);
    }
}

@keyframes cmove {
    from {
        transform: translateZ(-5px) translateY(0);
    }

    to {
        transform: translateZ(-5px) translateY(80px);
    }
}

svg {
    width: 0;
    height: 0;
}
</style>
