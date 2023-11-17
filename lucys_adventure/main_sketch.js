/* notes 
- refer to day12 for perlin system with mouse - use as soap and water (cleaning) for lucy
- need to let Lucy move till each end of canvas
- have attribute bar spread across canvas (despite size of screen)
- have attributes with visible bar (instead of just numbers)
- make options to 'start new game' or 'continue playing'
*/

let w = 500;
let h = 253;
let bg_x = -350;

// 0 instructions | 1 house | 2 cleaning | 3 feeding | 4 gallery-1 | 5 gallery-2 | 6 game | 7 game over
// INSTRUCTIONS - 0 overall instruction | 2.5 cleaning screen instruction | 3.5 feeding screen instruction | 6.5 game instruction
// game-1 will be in separate js files
let state = 1;
let most_recent_state = 1;

let startbasketballgame = false;

let gameovertransparency = 0;
let playedgameover = false;

let explanation_instruction = 1;
let first_time_jump = true;
let first_time_instruction = true;
let clicked_questionmark_instruction = false;

let explanation_tmp = 1;
let clicked_questionmark_clean = false;
let first_time_clean = true;

let explanation_tmp_eat = 1;
let clicked_questionmark_eat = false;
let first_time_eat = true;

let img_speed = 0;
let Lucy_initx = 130;
let Lucy_inity = 50;
let lucy_xspeed = 0;
let lucy_yspeed = 0;
let lucy_onground = true;
let lock = true;

let leftPressed = false;
let rightPressed = false;

let lvup = false;

let cleanness_value, nutrition_value;

let background, bathroom, Lucy_img, refrigerator, gallery_1, gallery_2, soap, bubble, questionmark, instruction_scroll, background_end, game_background, madsquare, basketballimg;

let angry, bubblesound, eating, error, opengallery, happy1, happy2, happy3, hungry, jump, levelup, money_spend, opendoor, shower, gameover, swish, basketball_game_over, backboardsound;

let hungrysoundplayed = false;
let bubblesoundplaying = false;
let showerplaying = false;
let levelupplayed = false;

let soap_x = 270;
let soap_y = 114;
let holding_soap = false;
let wateron = false;

let bubbles = [];
let waterfall = [];

let levelup_text_transparency = 0;

let tax = 1.1;

let netBottomX1 = 395;
let netBottomX2 = 445;
let netBottomY = 200;
let ball;
let gravity = 0.3;
let ballthrowX = 100;
let ballthrowY = 150;
let basketY = 150;
let score = 0;
let yMovement = 0; // -10 to 20
let rectangles = [];
let movementdirection = 1;
let startTime;
let gameDuration = 60000;
let basketballgameOver = false;
let readgameinstructions = false;
let tmpGold = 0;
let calculatedGold = false;

function preload() {
    //image files brought from freepik.com, canva, and personal photos
    background = loadImage("images/background.png");
    bathroom = loadImage("images/bathroom.png");
    Lucy_img = loadImage("images/Lucy.png");
    refrigerator = loadImage("images/refrigerator.png");
    gallery_1 = loadImage("images/gallery-1.jpeg");
    gallery_2 = loadImage("images/gallery-2.jpeg");
    soap = loadImage("images/soap.png");
    bubble = loadImage("images/bubble.png");
    questionmark = loadImage("images/question_mark.png");
    instruction_scroll = loadImage("images/scroll.png");
    background_end = loadImage("images/background_end.jpg");
    game_background = loadImage("images/gamebackground.jpg");
    madsquare = loadImage("images/square.png");
    basketballimg = loadImage("images/ball.png");

    //sound files all brought from youtube videos (free sound effects/no copyright)
    angry = loadSound("sounds/angry.mp3");
    bubblesound = loadSound("sounds/bubble.mp3");
    eating = loadSound("sounds/eating.mp3");
    error = loadSound("sounds/error.mp3");
    opengallery = loadSound("sounds/gallery.mp3");
    happy1 = loadSound("sounds/happy1.mp3");
    happy2 = loadSound("sounds/happy2.mp3");
    happy3 = loadSound("sounds/happy3.mp3");
    hungry = loadSound("sounds/hungry.mp3");
    jump = loadSound("sounds/jump.mp3");
    levelup = loadSound("sounds/levelup.mp3");
    money_spend = loadSound("sounds/money.mp3");
    opendoor = loadSound("sounds/opendoor.mp3");
    shower = loadSound("sounds/shower.mp3");
    gameover = loadSound("sounds/game_over.mp3");
    swish = loadSound("sounds/swish.mp3");
    basketball_game_over = loadSound("sounds/basketball_game_over.mp3");
    backboardsound = loadSound("sounds/backboard.mp3");
}

function setup() {
    let cnv = createCanvas(w, h);

    cnv.parent('#canvas_container');
    cnv.style('border', '1px solid black');
    cnv.style('display', 'block');
    cnv.style('margin', 'auto');

    lucy = new Lucy(Lucy_initx, Lucy_inity);
    ball = new Ball(ballthrowX, ballthrowY, 20);
    rectangles.push(new Rectangle(Math.random() * width, Math.random() * height, ball.radius * 1.5, ball.radius * 1.5));
    rectangles.push(new Rectangle(Math.random() * width, Math.random() * height, ball.radius * 1.5, ball.radius * 1.5));
}

function draw() {
    imageMode(CORNER);

    if(state == 0) {
        resizeCanvas(w, h);
        image(background, bg_x, -413);

        clicked_questionmark_instruction = false;

        push();
        imageMode(CENTER);
        tint(255, 225);
        image(instruction_scroll, width/2, height/2, 340, 280);
        pop();
        
        lucy.direction = 1;
        lucy.display();

        textSize(13);
        fill(0);
        text("INSTRUCTIONS", 204.5, 58);
        textSize(8);
        fill('brown')
        text("Click anywhere to continue", 207.5, 180);

        if(explanation_instruction == 1) {
            textSize(11.5);
            fill(70);
            text("Welcome to Lucy's Adventure!", 176, 120);
        }
        if(explanation_instruction == 2) {
            if(first_time_jump) {
                lucy_yspeed = -10;
                lucy_onground = false;
                jump.play();
                jump.setVolume(0.5);
                first_time_jump = false;
            }

            textSize(11);
            fill(70);
            text("This is Lucy!", 223, 100);
            text("Throughout this game, you are", 179, 125);
            text("responsible for taking care of her", 175, 140);
        }
        if(explanation_instruction == 3) {
            textSize(11);
            fill(70);
            text("You can move Lucy by using the", 174, 100);
            text("A and D keys", 221.5, 115);
            text("and you can make Lucy jump", 184, 135);
            text("by using the W key", 209, 150);
        }
        if(explanation_instruction == 4) {
            textSize(11);
            fill(70);
            text("By moving around the house,", 182, 90);
            text("you can find buttons that", 193.5, 105);
            text("send Lucy to various places –", 181.5, 120);
            text("the bathroom, refrigerator,", 191, 135);
            text("gallery, and video game", 198, 150);
        }
        if(explanation_instruction == 5) {
            textSize(11);
            fill(70);
            text("Right above the game screen,", 180, 100);
            text("there are four bars that", 197.5, 115);
            text("represent Lucy's health,", 197, 130);
            text("cleanness, nutrition, and xp", 188.5, 145);

            for(let i = 0; i < 4; i++) {
                let x = i * 89;
                switch(i) {
                    case 0:
                        if(frameCount % 100 > 10) {
                            drawArrows(x);
                        }
                        break;
                    case 1:
                        if(frameCount % 100 > 25) {
                            drawArrows(x);
                        }
                        break;
                    case 2:
                        if(frameCount % 100 > 40) {
                            drawArrows(x);
                        }
                        break;
                    case 3:
                        if(frameCount % 100 > 55) {
                            drawArrows(x);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        if(explanation_instruction == 6) {
            textSize(11);
            fill(70);
            text("The cleanness and nutrition", 186.5, 90);
            text("values will decrease over time", 180, 105);
            text("Lucy's health will also decrease", 177.5, 125);
            text("if either value reaches 0", 197, 140);
        }
        if(explanation_instruction == 7) {
            textSize(11);
            fill(70);
            text("You can increase the cleanness", 176.5, 100);
            text("and nutrition values by", 198.5, 115);
            text("sending Lucy to the bathroom", 182, 130);
            text("and feeding her respectively", 186, 145);
        }
        if(explanation_instruction == 8) {
            textSize(11);
            fill(70);
            text("You can increase Lucy's xp", 187.5, 90);
            text("by playing the video game,", 191, 105);
            text("feeding, or cleaning her", 197, 120);
            text("and increase her level", 201, 135);
            text("by gaining enough xp", 203, 150);
        }
        if(explanation_instruction == 9) {
            textSize(11);
            fill(70);
            text("You can also see Lucy's", 194.5, 105);
            text("money and level on", 207, 120);
            text("the attribuet bar above", 200.5, 135);

            for(let i = 0; i < 2; i++) {
                switch(i) {
                    case 0:
                        if(frameCount % 100 > 10) {
                            drawArrows(-75);
                        }
                        break;
                    case 1:
                        if(frameCount % 100 > 40) {
                            drawArrows(340);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        if(explanation_instruction == 10) {
            textSize(11);
            fill(70);
            text("Finally, you can earn money", 185, 105);
            text("by playing the video game", 190.5, 120);
            text("or levelling up", 221, 135);
        }
        if(explanation_instruction == 11) {
            textSize(11);
            fill(70);
            text("You can click on the question", 183, 115);
            text("mark to get help", 214.5, 130);
        }
        if(explanation_instruction == 12) {
            state = 1;
        }

        fill(255);
        noStroke();
        ellipse(15, 12, 12);
        image(questionmark, 5, 2, 20, 20);
    }

    if(state == 1 || state == 2 || state == 3 || state == 4 || state == 5) {
        cleanness_value = random(0.01, 0.025);
        nutrition_value = random(0.01, 0.025);
    }
    else {
        cleanness_value = 0;
        nutrition_value = 0;
    }

    if(state == 1) {
        if(first_time_instruction) {
            explanation_instruction = 1;
            first_time_instruction = false;
            state = 0;
        }

        most_recent_state = 1;
        resizeCanvas(w, h);
        image(background, bg_x, -413);

        lucy.display();

        bg_x -= img_speed;
        
        if(leftPressed) {
            leftMovement();
        }

        if(rightPressed) {
            rightMovement();
        }

        bg_x = constrain(bg_x, -575, 0);

        startbasketballgame = false;
        readgameinstructions = false;
        basketballgameOver = false;
        calculatedGold = false;

        shower.stop();      // in case it doens't stop

        document.getElementById('leave_bathroom_button').style.display = 'none';
        document.getElementById('close_refrigerator_button').style.display = 'none';
        document.getElementById('orange_button').style.display = 'none';
        document.getElementById('apple_button').style.display = 'none';
        document.getElementById('chocolate_button').style.display = 'none';
        document.getElementById('chicken_button').style.display = 'none';
        document.getElementById('bacon_button').style.display = 'none';
        document.getElementById('beef_button').style.display = 'none';
        document.getElementById('lobster_button').style.display = 'none';
        document.getElementById('leave_gallery_button').style.display = 'none';
        document.getElementById('game_button').style.display = 'none';

        if(bg_x < -30 && bg_x > -160) {
            document.getElementById('bathroom_button').style.display = 'flex';
        } else {
            document.getElementById('bathroom_button').style.display = 'none';
        }

        if(bg_x === -575 && lucy.xPos >= 155 && lucy.xPos <= 280) {
            document.getElementById('open_refrigerator_button').style.display = 'flex';
        } else {
            document.getElementById('open_refrigerator_button').style.display = 'none';
        }

        if(bg_x < -220 && bg_x > -285) {
            document.getElementById('gallery_1_button').style.display = 'flex';
        } else {
            document.getElementById('gallery_1_button').style.display = 'none';
        }

        if(bg_x < -495 && bg_x > -575) {
            document.getElementById('gallery_2_button').style.display = 'flex';
        } else {
            document.getElementById('gallery_2_button').style.display = 'none';
        }

        let happytmp = random(1, 4);
        if(lucy.health >= 80 && lucy.cleanness >= 80 && lucy.nutrition >= 80) {
            if(frameCount % 350 == 0) {
                if(happytmp < 2) {
                    happy1.play();
                }
                else if(happytmp < 3) {
                    happy2.play();
                }
                else {
                    happy3.play();
                }
            }
        }

        if(bg_x === 0 && lucy.xPos > -70 && lucy.xPos < 15) {
            document.getElementById('game_button').style.display = 'flex';
        } else {
            document.getElementById('game_button').style.display = 'none';
        }

        let d = dist(mouseX/2, mouseY/2, 15, 12);
        if(d < 6) {
            fill('lightblue');
            clicked_questionmark_instruction = true;
        }
        else {
            fill(255);
        }

        noStroke();
        ellipse(15, 12, 12);
        image(questionmark, 5, 2, 20, 20);
    }

    if(state == 2.5) {
        document.getElementById('leave_bathroom_button').style.display = 'none';

        clicked_questionmark_clean = false;

        document.getElementById('bathroom_button').style.display = 'none';
        resizeCanvas(400, 253);

        image(bathroom, 0, 0, 400, 294);

        push();
        textSize(10);
        fill(0);
        text("$15", 261.5, 100);
        pop();

        fill(222, 94, 94);
        ellipse(133, 90, 30, 15);

        fill(255);
        textSize(6);
        text("WATER", 122.5, 92);

        push();
        imageMode(CENTER);
        image(soap, soap_x, soap_y, 40, 40);
        pop();

        lucy.direction = 1;
        lucy.xPos = 80;
        lucy.yPos = 60;

        lucy.display();

        fill(255);
        noStroke();
        ellipse(15, 12, 12);
        image(questionmark, 5, 2, 20, 20);

        if(explanation_tmp == 1) {
            fill(0);
            ellipse(320, 45, 150, 60);
            fill(255)
            textSize(8);
            text("Using the soap costs $15 each time", 258, 40);
            text("Click on the soap once to pick it up", 258, 55);
            textSize(5);
            text("Click anywhere to continue", 289, 68);
        }
        if(explanation_tmp == 2) {
            fill(0);
            ellipse(320, 45, 150, 60);
            fill(255)
            textSize(8);
            text("Rub Lucy with the soap to start cleaning", 249.5, 42);
            text("Clicking again will drop the soap", 261, 55);
            textSize(5);
            text("Click anywhere to continue", 289, 68);
        }
        if(explanation_tmp == 3) {
            fill(0);
            ellipse(80, 45, 150, 60);
            fill(255)
            textSize(8);
            text("Now, we should rinse off the soap", 22, 40);
            text("Click and hold on 'water' to keep it on", 14, 55);
            textSize(5);
            text("Click anywhere to continue", 49, 68);
            fill(0);
            ellipse(90, 130, 85, 30);
            fill(255);
            textSize(6.5);
            text("Hovering over the 'water'", 55, 128);
            text("buton will make it green", 56, 137);
        }
        if(explanation_tmp == 4) {
            fill(0);
            ellipse(240, 45, 150, 60);
            fill(255);
            textSize(8);
            text("As you rinse the soap off of Lucy,", 182, 40);
            text("you will gain XP and cleanness", 187, 55);
            textSize(5);
            text("Click anywhere to continue", 209, 68);
        }
        if(explanation_tmp == 5) {
            fill(0);
            ellipse(100, 45, 150, 60);
            fill(255);
            textSize(10);
            text("If you need help,", 66, 40);
            text("click on the question mark", 42, 55);
            textSize(5);
            text("Click anywhere to continue", 70, 68);
        }
        if(explanation_tmp == 6) {
            fill(0);
            ellipse(240, 45, 150, 60);
            fill(255);
            textSize(11);
            text("Now, try to clean Lucy!", 185, 45);
            textSize(5);
            text("Click anywhere to continue", 209, 62);
        }
        if(explanation_tmp == 7) {
            state = 2;
        }
    }

    if(state == 2) {
        if(first_time_clean) {
            explanation_tmp = 1;
            first_time_clean = false;
            state = 2.5;
        }
        most_recent_state = 2

        document.getElementById('bathroom_button').style.display = 'none';
        resizeCanvas(400, 253);

        image(bathroom, 0, 0, 400, 294);

        push();
        textSize(10);
        fill(0);
        text("$15", 261.5, 100);
        pop();

        lucy.direction = 1;
        lucy.xPos = 80;
        lucy.yPos = 60;

        lucy.display();

        let d = dist(mouseX/2, mouseY/2, 15, 12);
        if(d < 6) {
            fill('lightblue');
            clicked_questionmark_clean = true;
        }
        else {
            fill(255);
        }

        noStroke();
        ellipse(15, 12, 12);
        image(questionmark, 5, 2, 20, 20);

        noStroke();
        if ((Math.pow(mouseX/2 - 133, 2) / Math.pow(15, 2)) + (Math.pow(mouseY/2 - 90, 2) / Math.pow(7.5, 2)) <= 1) {
            fill(68, 80, 255);
            if(mouseIsPressed) {
                waterfall.push(new Waterfall());
                wateron = true;

                if(!showerplaying) {
                    shower.play();
                    showerplaying = true;
                }
            }
            else {
                wateron = false;
                if(showerplaying) {
                    shower.stop();
                    showerplaying = false;
                }
            }
        }
        else {
            fill(222, 94, 94);
            wateron = false;
        }

        ellipse(133, 90, 30, 15);

        fill(255);
        textSize(6);
        text("WATER", 122.5, 92);

        push();
        imageMode(CENTER);
        image(soap, soap_x, soap_y, 40, 40);
        pop();

        if(holding_soap) {
            soap_x = mouseX/2;
            soap_y = mouseY/2;
        }
        else {
            soap_x = 270;
            soap_y = 116;
        }


        if(holding_soap && mouseX/4 > lucy.xPos && mouseX/4 < lucy.xPos + 30 && mouseY/4 > lucy.yPos && mouseY/4 < lucy.yPos + 35) {
            if(frameCount % 5 == 0) {
                bubbles.push(new Bubble());
            }
            
            if(!bubblesoundplaying) {
                bubblesound.play();
                bubblesound.setVolume(2);
                bubblesoundplaying = true;
            }
        }
        else {
            if(bubblesoundplaying) {
                bubblesound.stop();
                bubblesoundplaying = false;
            }
        }

        bubbles.length = constrain(bubbles.length, 0, 50);

        for (let i = bubbles.length - 1; i >= 0; i--) {
            bubbles[i].update();
            bubbles[i].display();

            if (bubbles[i].outofbounds() || bubbles[i].transparency <= 0) {
                bubbles.splice(i, 1);
            }
        }

        for (let i = 0; i < waterfall.length; i++) {
            waterfall[i].update();
            waterfall[i].display();

            if(waterfall[i].yPos > 222) {
                waterfall.splice(i, 1);
            }
        }

        document.getElementById('leave_bathroom_button').style.display = 'flex';
    }

    if(state == 3.5) {
        clicked_questionmark_eat = false;
        document.getElementById('open_refrigerator_button').style.display = 'none';

        document.getElementById('orange_button').style.display = 'flex';
        document.getElementById('apple_button').style.display = 'flex';
        document.getElementById('chocolate_button').style.display = 'flex';
        document.getElementById('chicken_button').style.display = 'flex';
        document.getElementById('bacon_button').style.display = 'flex';
        document.getElementById('beef_button').style.display = 'flex';
        document.getElementById('lobster_button').style.display = 'flex';

        
        image(refrigerator, 0, -12, 500, 420)
        document.getElementById('close_refrigerator_button').style.display = 'flex';

        fill(255);
        noStroke();
        ellipse(15, 12, 12);
        image(questionmark, 5, 2, 20, 20);
        push();
        fill(255);
        textSize(26);
        text("Menu", 53, 37);
        pop();

        push();
        textSize(12);
        fill(185,235,245);
        text("  Orange                   $10", 10, 68);
        text("  Apple                      $20", 10, 85);
        fill(224, 224, 224);
        text("  Chocolate               $30", 10, 107);
        text("  Chicken                  $50", 10, 124);
        text("  Bacon                     $60", 10, 141);
        fill(249, 232, 176);
        text("  Beef                        $80", 10, 163);
        text("  Lobster                   $110", 10, 180);
        
        fill(209, 243, 230);
        textSize(7);
        text("Prices are subjected to 10% tax as per LCW rates", 7, 204);
        pop();

        if(explanation_tmp_eat == 1) {
            fill(0);
            ellipse(230, 45, 110, 60);
            fill(255)
            textSize(8);
            text("Check the Menu for Prices", 184, 45);
            textSize(5);
            text("Click anywhere to continue", 200, 60);
        }
        if(explanation_tmp_eat == 2) {
            fill(0);
            ellipse(230, 45, 110, 60);
            fill(255)
            textSize(8);
            text("Click on the food label", 191, 35);
            text("to purchase the food", 193, 47);
            textSize(5);
            text("Click anywhere to continue", 200, 63);
        }
        if(explanation_tmp_eat == 3) {
            state = 3;
        }

    }

    if(state == 3) {
        if(first_time_eat) {
            explanation_tmp_eat = 1;
            first_time_eat = false;
            state = 3.5;
        }
        most_recent_state = 3;

        document.getElementById('open_refrigerator_button').style.display = 'none';

        document.getElementById('orange_button').style.display = 'flex';
        document.getElementById('apple_button').style.display = 'flex';
        document.getElementById('chocolate_button').style.display = 'flex';
        document.getElementById('chicken_button').style.display = 'flex';
        document.getElementById('bacon_button').style.display = 'flex';
        document.getElementById('beef_button').style.display = 'flex';
        document.getElementById('lobster_button').style.display = 'flex';

        
        image(refrigerator, 0, -12, 500, 420)
        document.getElementById('close_refrigerator_button').style.display = 'flex';

        let d = dist(mouseX/2, mouseY/2, 15, 12);
        if(d < 6) {
            fill('lightblue');
            clicked_questionmark_eat = true;
        }
        else {
            fill(255);
        }

        noStroke();
        ellipse(15, 12, 12);
        image(questionmark, 5, 2, 20, 20);
        push();
        fill(255);
        textSize(26);
        text("Menu", 53, 37);
        pop();

        push();
        textSize(12);
        fill(185,235,245);
        text("  Orange                   $10", 10, 68);
        text("  Apple                      $20", 10, 85);
        fill(224, 224, 224);
        text("  Chocolate               $30", 10, 107);
        text("  Chicken                  $50", 10, 124);
        text("  Bacon                     $60", 10, 141);
        fill(249, 232, 176);
        text("  Beef                        $80", 10, 163);
        text("  Lobster                   $110", 10, 180);
        
        fill(209, 243, 230);
        textSize(7);
        text("Prices are subjected to 10% tax as per LCW rates", 7, 204);
        pop();


    }

    if(state == 4 || state == 5) {
        most_recent_state = 4;
        resizeCanvas(gallery_1.width*0.175, h);
        document.getElementById('leave_gallery_button').style.display = 'flex';

        if(state == 4) {
            document.getElementById('gallery_1_button').style.display = 'none';
            image(gallery_1, 0, 0, gallery_1.width*0.175, gallery_1.height*0.175);
        }
        else if(state == 5) {
            document.getElementById('gallery_2_button').style.display = 'none';
            image(gallery_2, 0, 0, gallery_2.width*0.35, gallery_2.height*0.35);
        }

        fill(255);
        textSize(6);
        text("Photo taken by: Jeong Kyu Lee", 288, 240)
    }

    if(state == 6) {
        document.getElementById('game_button').style.display = 'none';
        playGame();
    }

    if(state == 7) {
        document.getElementById('leave_bathroom_button').style.display = 'none';
        document.getElementById('close_refrigerator_button').style.display = 'none';
        document.getElementById('orange_button').style.display = 'none';
        document.getElementById('apple_button').style.display = 'none';
        document.getElementById('chocolate_button').style.display = 'none';
        document.getElementById('chicken_button').style.display = 'none';
        document.getElementById('bacon_button').style.display = 'none';
        document.getElementById('beef_button').style.display = 'none';
        document.getElementById('lobster_button').style.display = 'none';
        document.getElementById('leave_gallery_button').style.display = 'none';
        document.getElementById('game_button').style.display = 'none';


        image(background_end, 0, 0, w, h);
        lucy.display();
        push();
        rectMode(CENTER);
        noStroke();
        fill(0, gameovertransparency);
        rect(width/2, height/2, 350, 220);
        pop();

        push();
        fill(255);
        textSize(40);
        textAlign(CENTER);
        text("GAME OVER", width/2, height/2);
        textSize(10);
        text("Click anywhere to restart", width/2, height/2 + 60);
        pop();
        
        if(!playedgameover) {
            gameover.play();
            playedgameover = true;
        }

        if(gameovertransparency < 255) {
            gameovertransparency += 2;
        }
    }

    // COORDINATES
    // text("bg_x: " , 120, 10, 10, 20);
    // text(bg_x, 155, 10, 10, 20);
    // text("lucyx: " , 220, 10, 10, 20);
    // text(lucy.xPos, 255, 10, 10, 20);
    // text(lucy.money, 295, 0, 10, 20);

    lucy.update();

    if(lucy.health <= 0) {
        state = 7;
    }

    if(lucy.cleanness <= 0) {
        lucy.health -= cleanness_value;
        if(frameCount % 250 == 0) {
            angry.play();
        }
    }
    else {
        lucy.cleanness -= cleanness_value;
    }

    if(lucy.nutrition <= 0) {
        if(!hungrysoundplayed) {
            hungry.play();
            hungrysoundplayed = true;
        }
        lucy.health -= nutrition_value;
    }
    else {
        hungrysoundplayed = false;
        lucy.nutrition -= nutrition_value;
    }

    lucy.health = constrain(lucy.health, 0, 100);
    lucy.cleanness = constrain(lucy.cleanness, 0, 100);
    lucy.nutrition = constrain(lucy.nutrition, 0, 100);
    
    if(lvup === true) {
        lucy.level += 1;
        lucy.money += map(lucy.level, 1, 5, 40, 200);
        levelup_text_transparency = 255;
        levelup.play();
        lvup = false;
    }

    lucy.level = constrain(lucy.level, 1, 5);

    push();
    noStroke();
    fill(255, 223, 0, levelup_text_transparency);
    ellipse(width/2, height/2 - 15, 300, 150);

    fill(0, levelup_text_transparency);
    textSize(50);
    textAlign(CENTER);
    text("LEVEL UP!", width/2, height/2 + 3.5);
    pop();

    if(levelup_text_transparency > 155) {
        levelup_text_transparency -= 1;
    }
    else if(levelup_text_transparency > 0) {
        levelup_text_transparency -= 4;
    }
}

class Rectangle {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.r = random(255);
      this.g = random(255);
      this.b = random(255);
      this.colorchange_r = random();
      this.colorchange_b = random();
      this.colorchange_g = random();
      this.pos_or_neg1 = random(1);
      this.pos_or_neg2 = random(1);
  
      this.velocityX = random(1, 2);
      this.velocityY = random(1, 2);

      if(this.pos_or_neg1 < 0.5) {
          this.velocityX *= -1;
      }
      if(this.pos_or_neg2 < 0.5) {
          this.velocityY *= -1;
      }
      
    }

    draw() {
        image(madsquare, this.x, this.y, this.width, this.height);
    }

    update() {
        this.r += this.colorchange_r;
        this.g += this.colorchange_g;
        this.b += this.colorchange_b;

        if(this.r >= 255 || this.r <= 100) {
            this.colorchange_r *= -1
        }
        if(this.g >= 255 || this.g <= 100) {
            this.colorchange_g *= -1
        }
        if(this.b >= 255 || this.b <= 100) {
            this.colorchange_b *= -1
        }

        this.x += this.velocityX;
        this.y += this.velocityY;

        if (this.x < 0) {
            this.x = 0;
            this.velocityX = -this.velocityX;
        } else if (this.x + this.width > width) {
            this.x = width - this.width;
            this.velocityX = -this.velocityX;
        }

        if (this.y < 0) {
            this.y = 0;
            this.velocityY = -this.velocityY;
        } else if (this.y + this.height > height) {
            this.y = height - this.height;
            this.velocityY = -this.velocityY;
        }
    }

    collision(ball) {
        if (ball.x + ball.radius >= this.x &&
            ball.x - ball.radius <= this.x + this.width &&
            ball.y + ball.radius >= this.y &&
            ball.y - ball.radius <= this.y + this.height) {
            return true;
        }
        return false;
    }
}

class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isShot = false;
        this.passedRim = false;
        this.scored = false;
        this.hitBackboard = false;
        this.recentlyCollided = false;
    }
  
    draw() {
        fill(250, 165, 0);
        noStroke();
        push();
        imageMode(CENTER);
        image(basketballimg, this.x, this.y, this.radius * 2, this.radius * 2);
        pop();
    }
  
    update() {
        if(movementdirection == 1 && yMovement < 20) {
            yMovement += 0.2;
        }
        if(yMovement >= 20) {
            movementdirection = -1;
        }
        if(movementdirection == -1 && yMovement > -10) {
            yMovement -= 0.2;
        }
        if(yMovement <= -10) {
            movementdirection = 1;
        }

        netBottomY = 200 + yMovement;
        basketY = 150 + yMovement;

        for (let i = 0; i < rectangles.length; i++) {
            if (rectangles[i].collision(this) && !this.recentlyCollided) {

                this.velocityX *= -1;
                this.velocityY *= -1;

                const boostFactor = 1.5;
                this.velocityX *= boostFactor;
                this.velocityY *= boostFactor;

                this.recentlyCollided = true;

                setTimeout(() => {      //copilot used
                    this.recentlyCollided = false;
                }, 100);
            }
        }
      
        if (this.isShot) {
            this.velocityY += gravity;
            this.x += this.velocityX;
            this.y += this.velocityY;
    
        if (!this.scored && this.y - this.radius < basketY + yMovement && this.y + this.radius >= basketY + yMovement && this.x > netBottomX1 && this.x < netBottomX2 && this.velocityY > 0) { 
            this.passedRim = true;
        }
  
        if (this.passedRim && this.y + this.radius > netBottomY && this.x > netBottomX1 && this.x < netBottomX2) { 
            this.scored = true;
        }
  
        if (this.scored && this.y + this.radius > height) {
          this.reset();
          score++;
          swish.play();
        }
  
        if (this.x + this.radius >= 455 && this.x - this.radius <= 465 && this.y >= 90 + yMovement && this.y <= 158 + yMovement && !this.hitBackboard) {
            this.velocityX = -this.velocityX * 0.5;
            this.velocityY *= 0.7;

            if (this.velocityX > 0) {
                this.x = 465 + this.radius;
            } else {
                this.x = 455 - this.radius;
            }
            this.hitBackboard = true;
            backboardsound.play();
        } 
        else if (this.x < 455 - this.radius || this.x > 465 + this.radius) {
            this.hitBackboard = false;
        }
  
        if (this.y > height - this.radius) {
          this.reset();
        }
  
        this.previousY = this.y;
        let hoopCenterX = (netBottomX1 + netBottomX2) / 2;

        if (this.y + this.radius > basketY + yMovement && this.y - this.radius < netBottomY + yMovement && this.x > netBottomX1 && this.x < netBottomX2 && this.velocityY > 0) {
            this.velocityY *= 0.8;
            this.velocityX *= 0.8;
  
            let centeringForce = (hoopCenterX - this.x) * 0.1;
            this.velocityX += centeringForce;
        }
  
        if (this.y + this.radius > height) {
            this.reset();
        }
      }
    }
  
    reset() {
        this.x = ballthrowX;
        this.y = ballthrowY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isShot = false;
        this.scored = false;
        this.passedRim = false;
    }
  
    shoot(velocityX, velocityY) {
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.isShot = true;
    }
}

function GameInstructions() {
    image(game_background, 0, 0, w, h);
    push();
    fill(255);
    textSize(30);
    textAlign(CENTER);
    text("Instructions", width/2, height/2 - 85);
    textSize(8);
    fill(196, 164, 132);
    text("Click anywhere to continue", width/2, height/2 + 100);
    pop();
    push();
    fill(255);
    textSize(11);
    textAlign(CENTER);
    fill(180);
    text("You have 60 seconds to score as many points as possible", width/2, height/2-50);
    text("You can move the mouse to aim the ball and click the mouse to shoot the ball", width/2, height/2-25)
    text("There also are intruders (square blocks) that will", width/2, height/2);
    text("try to disturb you and bounce the ball back at you", width/2, height/2 + 15);
    text("You get 1 point each time you score a basket", width/2, height/2 + 40);
    textSize(13);
    fill(240);
    text("Good Luck!", width/2, height/2 + 70);
    pop();
}

function playGame() {
    if(!readgameinstructions) {
        GameInstructions();
    }
    else {
        image(game_background, 0, 0, w, h);
        if(!basketballgameOver) {
            if(startbasketballgame == false) {
                startTime = millis();
                startbasketballgame = true;
            }

            if(!basketballgameOver) {
                let timeElapsed = (millis() - startTime);
                let timeRemaining = gameDuration - timeElapsed;
                
                let seconds = Math.floor(timeRemaining / 1000);
                push();
                fill(255);
                textSize(15);
                textAlign(CENTER);
                text('Time: ' + seconds, width/2, 30);
                pop();

                if(timeElapsed >= gameDuration) {
                    basketballgameOver = true;
                }
            }

            for (let i = 0; i < rectangles.length; i++) {
                rectangles[i].update();
                rectangles[i].draw();
            }

            if (!ball.isShot) {
                drawDottedTrajectory();
            }

            ball.draw();
            ball.update();

            drawRim();

            push();
            textAlign(CENTER);
            fill(255);
            textSize(15);
            text(`Score: ${score}`, width/8, 30);
            pop();
        }

        if(basketballgameOver) {
            if(calculatedGold == false) {
                tmpGold = Math.round(score * random(5, 10));
                calculatedGold = true;
                basketball_game_over.play();
            }

            push();
            textSize(60);
            fill(255, 0, 0);
            textAlign(CENTER);
            text("Time's Up!", width / 2, height / 2 - 20);
            fill(255);
            textSize(15);
            text('Final Score: ' + score, width / 2, height / 2 + 30);
            text('You earn: $ ' + tmpGold, width / 2, height / 2 + 55);
            textSize(8);
            fill(196, 164, 132);
            text("Click anywhere to continue", width/2, height/2 + 100);
            pop();
        }
    }
}

function drawRim() {
    push();
    stroke(255, 255, 255); //net
    strokeWeight(2);
    line(395, 150 + yMovement, 403, 200 + yMovement);
    line(445, 150 + yMovement, 437, 200 + yMovement);
    line(403, 200 + yMovement, 437, 200 + yMovement);
    line(395, 150 + yMovement, 437, 200 + yMovement);
    line(445, 150 + yMovement, 403, 200 + yMovement);
    line(400, 175 + yMovement, 420, 200 + yMovement);
    line(420, 200 + yMovement, 440, 175 + yMovement);
    line(440, 175 + yMovement, 414, 150 + yMovement);
    line(400, 175 + yMovement, 426, 150 + yMovement);
    line(407, 150 + yMovement, 397, 160 + yMovement);
    line(433, 150 + yMovement, 443, 160 + yMovement);
    pop();
    push();
    stroke(255, 0, 0);
    strokeWeight(5);
    line(390, 150 + yMovement, 450, 150 + yMovement); //rim
    pop();
    push();
    stroke(165,42,42);
    strokeWeight(8);
    line(455, 90 + yMovement, 455, 158 + yMovement); //backboard
    pop();
}

function drawDottedTrajectory() {
    let simX = ballthrowX;
    let simY = ballthrowY;
    let simVelocityX = (ballthrowX - mouseX/2) * 0.1;
    let simVelocityY = (ballthrowY - mouseY/2) * 0.1;
  
    let spacing = 80;
    let dotSize = 2;
    let trajectoryGravity = gravity;
  
    for (let t = 0; simY <= height && t < 1000; t += spacing) {
      noStroke();
      fill(255);
      ellipse(simX, simY, dotSize, dotSize);
  
      simX += simVelocityX;
      simY += simVelocityY;
      simVelocityY += trajectoryGravity;
    }
  }


function drawArrows(x) {
    beginShape();
    fill(0);
    vertex(118 + x, 2);
    vertex(107 + x, 17);
    vertex(113 + x, 15);
    vertex(113 + x, 33);
    vertex(123 + x, 33);
    vertex(123 + x, 15);
    vertex(129 + x, 17);
    vertex(118 + x, 2);
    endShape();
}

function leftMovement() {
    if(bg_x >= 0 && lucy.xPos <= 130) {
        bg_x = 0;
        lucy_xspeed = -5;
        lucy.direction = -1;
    } else if(bg_x === -575 && lucy.xPos >= 130) {
        lucy.xPos = constrain(lucy.xPos, 130, 320);
        lucy_xspeed = -5;
        lucy.direction = -1;
    } else {
        lucy.xPos = 130;
        img_speed = -5;
        lucy.direction = -1;
    }
}

function rightMovement() {
    if(bg_x <= -575 && lucy.xPos >= 130) {
        bg_x = -575;
        lucy_xspeed = 5;
        lucy.direction = 1;
    } else if(bg_x === 0 && lucy.xPos <= 130) {
        lucy.xPos = constrain(lucy.xPos, -75, 130);
        lucy_xspeed = 5;
        lucy.direction = 1;
    } else {
        lucy.xPos = 130;
        img_speed = 5;
        lucy.direction = 1;
    }
}

function changestate(state_input) {
    if(state_input == 4 || state_input == 5) {
        opengallery.play();
        opengallery.setVolume(2);
    }
    if(most_recent_state == 4 && state_input == 1) {
        opengallery.play();
        opengallery.setVolume(2);
    }

    if(state_input == 2 || state_input == 3) {
        opendoor.play();
    }
    if(state_input == 1 && (most_recent_state == 2 || most_recent_state == 3)) {
        opendoor.play();
    }

    if(state_input == 6) {
        opendoor.play();
    }

    state = state_input;
}

function purchasefood(price) {
    if(state == 3) {
        let total_price = price * tax;
        if(lucy.money >= Math.round(total_price)) {
            money_spend.play();
            setTimeout(function() {
                eating.play();
            }, 500);

            lucy.money = Math.round(lucy.money - total_price);
            let tmp = map(total_price, 11, 121, 2, 40); //amount of xp/nutrition gain
            lucy.xp += random(tmp - 2, tmp + 2);

            if(lucy.xp >= 100) {
                lvup = true;
                lucy.xp -= 100;
            }

            lucy.nutrition += random(tmp - 3, tmp + 3);

            if(lucy.nutrition >= 100) {
                lucy.nutrition = 100;
            }

            if(lucy.health < 100) {
                lucy.health += random(tmp - 3, tmp + 3);
                if(lucy.health >= 100) {
                    lucy.health = 100;
                }
            }
        }
        else {
            error.play();
        }
    }
}


class Lucy {
    constructor(x, y) {
        this.xPos = x;
        this.yPos = y;
        this.direction = -1
        this.money = 100;
        this.health = 100;
        this.cleanness = 100;
        this.nutrition = 100;
        this.xp = 0;
        this.level = 1;
    }
    display() {
        push();
        if (this.direction === 1) {
            translate(this.xPos, this.yPos);
        } else {
            translate(this.xPos + h, this.yPos);
        }
        scale(this.direction, 1);

        if(state == 0) {
            image(Lucy_img, -180, 0, 500, 300);
        }
        if(state == 1) {
            image(Lucy_img, 0, 0, 500, 300);
        }
        if(state == 2 || state == 2.5) {
            image(Lucy_img, 5, 0, 400, 240);
        }
        if(state == 7) {
            this.direction = 1;
            image(Lucy_img, -20, 40, 400, 240);
        }
        pop();
    }
    update() {
        this.yPos += lucy_yspeed;
        this.xPos += lucy_xspeed;

        this.xPos = constrain(this.xPos, -75, 320);

        if(this.yPos < Lucy_inity) {
            lucy_yspeed += 1;
        }
        if(this.yPos >= Lucy_inity) {
            lucy_yspeed = 0;
            this.yPos = Lucy_inity;
            lucy_onground = true;
        }

        document.getElementById('money').innerHTML = this.money;
        document.getElementById('health_fill').style.width = `${this.health}%`;
        document.getElementById('cleanness_fill').style.width = `${this.cleanness}%`;
        document.getElementById('nutrition_fill').style.width = `${this.nutrition}%`;
        document.getElementById('xp_fill').style.width = `${this.xp}%`;
        document.getElementById('level').innerHTML = this.level;
    }
}


class Bubble {
    constructor() {
        this.xPos = random(mouseX/2 - 2, mouseX/2 + 2);
        this.yPos = random(mouseY/2 - 2, mouseY/2 + 2);
        this.size = random(8, 25);
        this.xOff = random(0, 1000);
        this.yOff = random(0, 1000);
        this.transparency = 255;
        this.alpha_speed = random(0.7, 2.5);
        this.leaveonbody = random(1, 100);
        this.washedspeed = random(0.5, 2);
        this.gave_xp = false;
    }

    update() {
        if(this.leaveonbody < 50) {
            this.xPos += map(noise(this.xOff), 0, 1, -1, 1);
            this.yPos += map(noise(this.yOff), 0, 1, -2, -1);
            this.xOff += 0.01;
            this.yOff += 0.01;
            this.transparency -= this.alpha_speed;
        }
        else {
            if(wateron === true) {
                if(this.transparency < 120) {
                    this.transparency -= this.washedspeed * 3;
                }
                else {
                    this.transparency -= this.washedspeed;
                }

                if(this.transparency < 10 && this.gave_xp === false) {
                    let clean_tmp = random(2, 5)
                    if(lucy.cleanness < 100) {
                        lucy.cleanness += clean_tmp;
                        lucy.xp += clean_tmp/15;
                    }
                    if(lucy.cleanness >= 100) {
                        lucy.cleanness = 100;
                    }

                    if(lucy.xp >= 100) {
                        lvup = true;
                        lucy.xp -= 100;
                    }
                    this.gave_xp = true;
                }
            }
        }
    }

    display() {
        imageMode(CENTER);
        tint(255, this.transparency);
        image(bubble, this.xPos, this.yPos, this.size, this.size);
        noTint();
    }

    outofbounds() {
        return this.yPos + this.size < 0;
    }
}


class Waterfall {
    constructor() {
        this.xPos = random(width/2 - 30, width/2 + 18);
        this.yPos = 20;
        this.height = 12;
        this.width = random(1, 2);
        this.speed = random(3, 7);
    }

    update() {
        this.yPos += this.speed;
    }

    display() {
        fill(100, 157, 243, 150);
        noStroke();
        rectMode(CENTER);
        rect(this.xPos, this.yPos, this.width, this.height, 1);
    }
}


function keyPressed() {
    if (key === 'a' || key === 'A') {
        leftPressed = true;
    }

    if(key === 'd' || key === 'D') {
        rightPressed = true;
    }

    if(key === 'w' || key === 'W') {
        if(lucy_onground == true) {
            lucy_yspeed = -10;
            lucy_onground = false;
            jump.play();
            jump.setVolume(0.5);
            console.log("jump");
        }
    }
}

function keyReleased() {
    if (key === 'a' || key === 'A') {
        img_speed = 0;
        lucy_xspeed = 0;
        leftPressed = false;
    }

    if (key === 'd' || key === 'D') {
        img_speed = 0;
        lucy_xspeed = 0;
        rightPressed = false;
    }
}

function mousePressed() {
    if(state == 0) {
        explanation_instruction += 1;
    }

    if(state == 2.5) {
        explanation_tmp += 1;
    }

    if(state == 3.5) {
        explanation_tmp_eat += 1;
    }

    if(state == 2) {
        if(holding_soap) {
            holding_soap = false;
        }
        else if(mouseX/2 > soap_x - 20 && mouseX/2 < soap_x + 20 && mouseY/2 > soap_y - 20 && mouseY/2 < soap_y + 20) {
            if(lucy.money >= 15) {
                holding_soap = true;
                money_spend.play();
                lucy.money -= 15;
            }
            else{
                error.play();
            }
        }

        if(clicked_questionmark_clean) {
            explanation_tmp = 1;
            state = 2.5;
        }
    }

    if(state == 3) {
        if(clicked_questionmark_eat) {
            explanation_tmp_eat = 1;
            state = 3.5;
        }
    }

    if(state == 1) {
        if(clicked_questionmark_instruction) {
            explanation_instruction = 1;
            state = 0;
        }
    }

    if(state == 6) {
        if(!readgameinstructions) {
            readgameinstructions = true;
        }
        else {
            if (!ball.isShot && !basketballgameOver) {
                let shotVectorX = ballthrowX - mouseX/2;
                let shotVectorY = ballthrowY - mouseY/2;
                let forceMultiplier = 0.1;
                ball.shoot(shotVectorX * forceMultiplier, shotVectorY * forceMultiplier);
            }
        }
        if(basketballgameOver) {
            state = 1;
            lucy.money += tmpGold;
        }
    }

    if(state == 7) {
        most_recent_state = 1;
        gameovertransparency = 0;
        explanation_instruction = 1;
        first_time_jump = true;
        first_time_instruction = true;
        clicked_questionmark_instruction = false;
        explanation_tmp = 1;
        clicked_questionmark_clean = false;
        first_time_clean = true;
        explanation_tmp_eat = 1;
        clicked_questionmark_eat = false;
        first_time_eat = true;

        lucy.direction = -1
        lucy.money = 100;
        lucy.health = 100;
        lucy.cleanness = 100;
        lucy.nutrition = 100;
        lucy.xp = 0;
        lucy.level = 1;
        lucy.xPos = Lucy_initx;
        lucy.yPos = Lucy_inity;

        state = 1;
    }
}