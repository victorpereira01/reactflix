import React from 'react';

import './index.css';

import spritesImg from '../../assets/img/sprites.png'
import som_Hit from '../../assets/efeitos/hit.wav';

function Page404() {
    const sprites = new Image();
    sprites.src = spritesImg;

    const somHit = new Audio();
    somHit.src = som_Hit;

    window.onload = function () {
        const canvas = document.querySelector('canvas');
        const contexto = canvas.getContext('2d');

        let telaAtiva = {};
        let frames = 0;

        const globais = {};

        function fazColisao(flappyBird, chao) {
            const flappyBirdY = flappyBird.y + flappyBird.altura;
            const chaoY = chao.y;

            if (flappyBirdY >= chaoY) {
                return true;
            }
            return false;
        }

        function criaFlappyBird() {
            const flappyBird = {
                spriteX: 0,
                spriteY: 0,
                largura: 33,
                altura: 24,
                x: 10,
                y: 50,
                velocidade: 0,
                gravidade: 0.25,
                pulo: 4.6,
                movimentos: [
                    { spriteX: 0, spriteY: 0 },
                    { spriteX: 0, spriteY: 26 },
                    { spriteX: 0, spriteY: 52 },
                ],
                frameAtual: 0,

                atualizaFrameAtual() {
                    const intervaloDeFrames = 10;
                    const passouOIntervalo = frames % intervaloDeFrames === 0;

                    if (passouOIntervalo) {
                        const baseDoIncremento = 1;
                        const incremento = baseDoIncremento + flappyBird.frameAtual;
                        const baseRepeticao = flappyBird.movimentos.length;
                        flappyBird.frameAtual = incremento % baseRepeticao;
                    }
                },

                pula() {
                    flappyBird.velocidade = -flappyBird.pulo;
                },

                atualiza() {
                    if (fazColisao(flappyBird, globais.chao)) {
                        somHit.play();

                        setTimeout(() => {
                            mudaParaTela(Telas.INICIO);
                        }, 500);

                        return;
                    }
                    flappyBird.velocidade += flappyBird.gravidade;
                    flappyBird.y += flappyBird.velocidade;
                },

                desenha() {
                    flappyBird.atualizaFrameAtual();

                    const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];

                    contexto.drawImage(
                        sprites,
                        spriteX, spriteY,
                        flappyBird.largura, flappyBird.altura,
                        flappyBird.x, flappyBird.y,
                        flappyBird.largura, flappyBird.altura,
                    );
                }
            }
            return flappyBird;
        }

        function criaChao() {
            const chao = {
                spriteX: 0,
                spriteY: 610,
                largura: 224,
                altura: 112,
                x: 0,
                y: canvas.height - 112,

                atualiza() {
                    const movimentoDoChao = 1;
                    const repeteEm = chao.largura / 2;
                    const movimentacao = chao.x - movimentoDoChao;

                    chao.x = movimentacao % repeteEm;
                },

                desenha() {
                    contexto.drawImage(
                        sprites,
                        chao.spriteX, chao.spriteY,
                        chao.largura, chao.altura,
                        chao.x, chao.y,
                        chao.largura, chao.altura,
                    );

                    contexto.drawImage(
                        sprites,
                        chao.spriteX, chao.spriteY,
                        chao.largura, chao.altura,
                        (chao.x + chao.largura), chao.y,
                        chao.largura, chao.altura,
                    );
                },
            };
            return chao;
        }

        function criaCanos() {
            const canos = {
                largura: 52,
                altura: 400,
                chao: {
                    spriteX: 0,
                    spriteY: 169,
                },
                ceu: {
                    spriteX: 52,
                    spriteY: 169,
                },
                espaco: 80,
                pares: [],

                desenha() {
                    canos.pares.forEach(function (par) {
                        const yRandom = par.y;
                        const espacamentoEntreCanos = 90;

                        const canoCeuX = par.x;
                        const canoCeuY = yRandom;

                        contexto.drawImage(
                            sprites,
                            canos.ceu.spriteX, canos.ceu.spriteY,
                            canos.largura, canos.altura,
                            canoCeuX, canoCeuY,
                            canos.largura, canos.altura,
                        )

                        const canoChaoX = par.x;
                        const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
                        contexto.drawImage(
                            sprites,
                            canos.chao.spriteX, canos.chao.spriteY,
                            canos.largura, canos.altura,
                            canoChaoX, canoChaoY,
                            canos.largura, canos.altura,
                        )

                        par.canoCeu = {
                            x: canoCeuX,
                            y: canos.altura + canoCeuY
                        }
                        par.canoChao = {
                            x: canoChaoX,
                            y: canoChaoY
                        }
                    })
                },

                temColisaoComOFlappyBird(par) {
                    const cabecaDoFlappy = globais.flappyBird.y;
                    const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

                    if (globais.flappyBird.x >= par.x) {
                        if (cabecaDoFlappy <= par.canoCeu.y) {
                            return true;
                        }
                        if (peDoFlappy >= par.canoChao.y) {
                            return true;
                        }
                    }
                    return false;
                },

                atualiza() {
                    const passou100Frames = frames % 100 === 0;
                    if (passou100Frames) {
                        canos.pares.push({
                            x: canvas.width,
                            y: -150 * (Math.random() + 1),
                        });
                    }

                    canos.pares.forEach(function (par) {
                        par.x = par.x - 2;

                        if (canos.temColisaoComOFlappyBird(par)) {
                            mudaParaTela(Telas.INICIO);
                        }

                        if (par.x + canos.largura <= 0) {
                            canos.pares.shift();
                        }
                    });
                }
            }
            return canos;
        }

        const mensagemGetReady = {
            sX: 134,
            sY: 0,
            w: 174,
            h: 152,
            x: (canvas.width / 2) - 174 / 2,
            y: 50,

            desenha() {
                contexto.drawImage(
                    sprites,
                    mensagemGetReady.sX, mensagemGetReady.sY,
                    mensagemGetReady.w, mensagemGetReady.h,
                    mensagemGetReady.x, mensagemGetReady.y,
                    mensagemGetReady.w, mensagemGetReady.h
                );
            }
        }

        const planoDeFundo = {
            spriteX: 390,
            spriteY: 0,
            largura: 275,
            altura: 204,
            x: 0,
            y: canvas.height - 204,
            desenha() {
                contexto.fillStyle = '#70c5ce';
                contexto.fillRect(0, 0, canvas.width, canvas.height)

                contexto.drawImage(
                    sprites,
                    planoDeFundo.spriteX, planoDeFundo.spriteY,
                    planoDeFundo.largura, planoDeFundo.altura,
                    planoDeFundo.x, planoDeFundo.y,
                    planoDeFundo.largura, planoDeFundo.altura,
                );

                contexto.drawImage(
                    sprites,
                    planoDeFundo.spriteX, planoDeFundo.spriteY,
                    planoDeFundo.largura, planoDeFundo.altura,
                    (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
                    planoDeFundo.largura, planoDeFundo.altura,
                );
            },
        };

        function mudaParaTela(novaTela) {
            telaAtiva = novaTela;

            if (telaAtiva.inicializa) {
                telaAtiva.inicializa();
            }
        }

        const Telas = {
            INICIO: {
                inicializa() {
                    globais.flappyBird = criaFlappyBird();
                    globais.chao = criaChao();
                    globais.canos = criaCanos();
                },
                desenha() {
                    planoDeFundo.desenha();

                    globais.flappyBird.desenha();
                    globais.chao.desenha();

                    mensagemGetReady.desenha();
                },
                click() {
                    mudaParaTela(Telas.JOGO);
                },
                atualiza() {
                    globais.chao.atualiza();
                }
            }
        };

        Telas.JOGO = {
            desenha() {
                planoDeFundo.desenha();

                globais.canos.desenha();
                globais.chao.desenha();
                globais.flappyBird.desenha();
            },
            click() {
                globais.flappyBird.pula();
            },
            atualiza() {
                globais.canos.atualiza();
                globais.chao.atualiza();
                globais.flappyBird.atualiza();
            }
        };

        function loop() {
            telaAtiva.desenha();
            telaAtiva.atualiza();

            frames++;

            requestAnimationFrame(loop);
        }

        mudaParaTela(Telas.INICIO);
        loop();

        window.addEventListener('click', function () {
            if (telaAtiva.click) {
                telaAtiva.click();
            }
        })
    }

    return (
        <div id="seletor">
            <h1>404 Page Not Found</h1>
            <h1>Não achei o que você pediu &#128532;</h1>
            <h1>Mas achei isso:</h1>
            <canvas id="canvas" width="320" height="480"></canvas>
        </div>
    )
}

export default Page404;