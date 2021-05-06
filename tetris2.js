window.addEventListener("DOMContentLoaded",function(){
    var canvas = document.getElementById("canvas");
    var engine = new BABYLON.Engine(canvas,true);

    var createScene = function(){
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3.Black();

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));
        var ground = BABYLON.Mesh.CreateGround("ground1",20,20,20, scene);
        ground.position = new BABYLON.Vector3(0,-0.5,0);

        var left = BABYLON.Mesh.CreateGround("ground1",10,10,10, scene);
        left.position = new BABYLON.Vector3(-5.5,4.5,0);
        left.rotation.z  =  -Math.PI/2;
        
        var right = BABYLON.Mesh.CreateGround("ground1",10,10,10, scene);
        right.position = new BABYLON.Vector3(4.5,4.5,0);
        right.rotation.z  =  Math.PI/2;


        var camera = new BABYLON.ArcRotateCamera("Camera",-Math.PI / 2, Math.PI / 2, 30, new BABYLON.Vector3(0, 0, 0), scene);
        scene.activeCamera.attachControl(canvas);
        camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");

        var arena = new Array(10);
        for(i=0;i<10;i++){
            arena[i]=new Array(10).fill(0);
        }

        var boxes = new Array(10);
        for(i=0;i<10;i++){
            boxes[i]=new Array(10);
        }

        var currentPiece;
        
        var piece={
            pos1: {x:0,y:0},
            pos2: {x:0,y:0},
            pos3: {x:0,y:0},
            pos4: {x:0,y:0},
        }

        const piece_1 = [
            [0,0,0,0],
            [1,1,1,0],
            [0,1,0,0],
            [0,0,0,0],
        ];

        const piece_2 = [
            [1,1,0,0],
            [1,1,0,0],
            [0,0,0,0],
            [0,0,0,0],
        ];

        const piece_3 = [
            [1,0,0,0],
            [1,1,0,0],
            [0,1,0,0],
            [0,0,0,0],
        ];

        const piece_4 = [
            [1,0,0,0],
            [1,1,1,0],
            [0,0,0,0],
            [0,0,0,0],
        ];

        const piece_5 = [
            [1,0,0,0],
            [1,0,0,0],
            [1,0,0,0],
            [1,0,0,0],
        ];

     
        var pieces=new Array(piece_1,piece_2,piece_3,piece_4,piece_5);
            
        function positionPiece(piece,arena,offset_x,offset_y){
         
            if(arena[piece.pos1.x+offset_x][piece.pos1.y+offset_y]!= 1 && arena[piece.pos2.x+offset_x][piece.pos2.y+offset_y]!= 1 && arena[piece.pos3.x+offset_x][piece.pos3.y+offset_y]!= 1 && arena[piece.pos4.x+offset_x][piece.pos4.y+offset_y] != 1){
                arena[piece.pos1.x+offset_x][piece.pos1.y+offset_y]=1;
                arena[piece.pos2.x+offset_x][piece.pos2.y+offset_y]=1;
                arena[piece.pos3.x+offset_x][piece.pos3.y+offset_y]=1;
                arena[piece.pos4.x+offset_x][piece.pos4.y+offset_y]=1;
            }else{
                return false;
            }
        }

        function moveHorizontally(piece,arena,boxes){
            document.addEventListener('keydown',event=>{
                if(event.keyCode==37){
                    if(piece.pos1.y>=1 && piece.pos2.y>=1 && piece.pos3.y>=1 && piece.pos4.y>=1 && !checkCollisionLeft(piece,arena)){
                            
                        arena[piece.pos1.x][piece.pos1.y]= 0;
                        arena[piece.pos2.x][piece.pos2.y]= 0;
                        arena[piece.pos3.x][piece.pos3.y]= 0;
                        arena[piece.pos4.x][piece.pos4.y]= 0;

                        boxes[piece.pos1.x][piece.pos1.y].setEnabled(false);
                        boxes[piece.pos2.x][piece.pos2.y].setEnabled(false);
                        boxes[piece.pos3.x][piece.pos3.y].setEnabled(false);
                        boxes[piece.pos4.x][piece.pos4.y].setEnabled(false);

                        arena[piece.pos1.x][piece.pos1.y-1]= 1;
                        arena[piece.pos2.x][piece.pos2.y-1]= 1;
                        arena[piece.pos3.x][piece.pos3.y-1]= 1;
                        arena[piece.pos4.x][piece.pos4.y-1]= 1;
                            
                        piece.pos1.y-=1;
                        piece.pos2.y-=1;
                        piece.pos3.y-=1;
                        piece.pos4.y-=1;

                        renderArena(arena,boxes);
                    }   
                }else if(event.keyCode==39){
                    if(piece.pos1.y<9 && piece.pos2.y<9 && piece.pos3.y<9 && piece.pos4.y<9 && !checkCollisionRight(piece,arena)){

                        arena[piece.pos1.x][piece.pos1.y]=0;
                        arena[piece.pos2.x][piece.pos2.y]=0;
                        arena[piece.pos3.x][piece.pos3.y]=0;
                        arena[piece.pos4.x][piece.pos4.y]=0;

                        boxes[piece.pos1.x][piece.pos1.y].setEnabled(false);
                        boxes[piece.pos2.x][piece.pos2.y].setEnabled(false);
                        boxes[piece.pos3.x][piece.pos3.y].setEnabled(false);
                        boxes[piece.pos4.x][piece.pos4.y].setEnabled(false);

                        arena[piece.pos1.x][piece.pos1.y+1]= 1;
                        arena[piece.pos2.x][piece.pos2.y+1]= 1;
                        arena[piece.pos3.x][piece.pos3.y+1]= 1;
                        arena[piece.pos4.x][piece.pos4.y+1]= 1;
                            
                        piece.pos1.y+=1;
                        piece.pos2.y+=1;
                        piece.pos3.y+=1;
                        piece.pos4.y+=1;

                        renderArena(arena,boxes);
                    }
                } 
            })
        }

        function renderArena(arena,boxes){           
            for(i=0;i<10;i++){
                for(j=0;j<10;j++){
                    if(arena[i][j]!=0){
                        var str1=i.toString();
                        var str2=j.toString();
                        var name = str1.concat(str2);
                            if(!scene.getMeshByName(name)){
                                boxes[i][j]=BABYLON.Mesh.CreateBox(name,1,scene)
                            }else{
                                boxes[i][j].setEnabled(true);
                            }
                        var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
                        myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
                        //myMaterial.bumpTexture = new BABYLON.Texture("texture.jpg", scene);
                        //myMaterial.alpha=0.9;
                        boxes[i][j].material = myMaterial;
                        boxes[i][j].showBoundingBox=true;
                        boxes[i][j].position = new BABYLON.Vector3(j-5, 9-i, 0);  
                    }
                }
            }
        }

        function newPiece(pieces){
            return pieces[Math.floor(Math.random()*pieces.length)];                           
        }

        function getPieceCoordinates(matrix,piece,offset_x,offset_y){
            var temp=1;
            for(var i=0;i<4;i++){
                for(var j=0;j<4;j++){
                    if(matrix[i][j]==1){
                        switch(temp) {
                            case 1:
                                piece.pos1.x=i+offset_x;
                                piece.pos1.y=j+offset_y;
                                temp++;
                              break;
                            case 2:
                                piece.pos2.x=i+offset_x;
                                piece.pos2.y=j+offset_y;
                                temp++;
                              break;
                            case 3:
                                piece.pos3.x=i+offset_x;
                                piece.pos3.y=j+offset_y;
                                temp++;
                              break;
                            case 4:
                                piece.pos4.x=i+offset_x;
                                piece.pos4.y=j+offset_y;
                                temp++;
                              break;
                          } 
                    }
                }
            }
        }

        function checkGameOver(piece,arena){
            if(arena[piece.pos1.x][piece.pos1.y] == 1 || arena[piece.pos2.x][piece.pos2.y] == 1 || arena[piece.pos3.x][piece.pos3.y] == 1 || arena[piece.pos4.x][piece.pos4.y] == 1){
                return true;
            }else{
                return false;
            }

        }

        function moveDown(arena,piece,boxes){
            if(piece.pos1.x < 9 && piece.pos2.x < 9 && piece.pos3.x < 9 && piece.pos4.x < 9 && !checkCollision(piece,arena)){
                
                arena[piece.pos1.x][piece.pos1.y]=0;
                arena[piece.pos2.x][piece.pos2.y]=0;
                arena[piece.pos3.x][piece.pos3.y]=0;
                arena[piece.pos4.x][piece.pos4.y]=0;
                
                boxes[piece.pos1.x][piece.pos1.y].setEnabled(false);
                boxes[piece.pos2.x][piece.pos2.y].setEnabled(false);
                boxes[piece.pos3.x][piece.pos3.y].setEnabled(false);
                boxes[piece.pos4.x][piece.pos4.y].setEnabled(false);
                
                arena[piece.pos1.x+1][piece.pos1.y]=1;
                arena[piece.pos2.x+1][piece.pos2.y]=1;
                arena[piece.pos3.x+1][piece.pos3.y]=1;
                arena[piece.pos4.x+1][piece.pos4.y]=1;

                piece.pos1.x+=1;
                piece.pos2.x+=1;
                piece.pos3.x+=1;
                piece.pos4.x+=1;

                
                renderArena(arena,boxes);
                shiftArenaDown(arena,boxes);
               
            }else{
                clearInterval(myVar);
                currentPiece=newPiece(pieces);
                getPieceCoordinates(currentPiece,piece,0,0);
                if(!checkGameOver(piece,arena)){
                    positionPiece(piece,arena,0,0);
                    renderArena(arena,boxes);
                    rotate(currentPiece,arena);
                    myVar = setInterval(moveDown, 1000,arena,piece,boxes);
                }else{
                    console.log('Game over');
                    console.log("Your score is:");
                    console.log(score);
                    console.log(arena);
                    console.log(boxes);
                    //scene.dispose();
                }
                
            }  
        }
        
        var score=0;
        function checkForCompletedRow(arena){
            var tmp=false;
            for(var i=0;i<10;i++){
                for(var j=0;j<10;j++){       
                    if(arena[i][j]==1){
                        tmp=true;
                    }else{
                        tmp=false;
                        break;
                    }              
                }
                if(tmp){
                    return i;
                   }
            }
            return null;
        }

       
        function shiftArenaDown(arena,boxes){
            var index=checkForCompletedRow(arena);
            if(index != null){

                for(var i=index;i<10;i++){
                    for(var j=0;j<10;j++){
                        
                        arena[i][j]=arena[i-1][j];
                        var str1=i.toString();
                        var str2=j.toString();
                        var name = str1.concat(str2);
                        if(scene.getMeshByName(name))
                            boxes[i][j].setEnabled(false);
                     }
                }
                arena[0].fill(0);
                score++;
                console.log(arena);
                renderArena(arena,boxes);
            }
        }
        
        function checkCollisionRight(piece,arena){
            var val=Object.values(piece);
            var found = false;
            for(var i=0;i<4;i++){
                if(arena[val[i].x][val[i].y+1] == 1){
                    for(var j=0;j<4;j++){
                        if((val[i].y+1 == val[j].y && val[i].x == val[j].x)){
                            found=true;
                            break;
                        }else{
                            found=false;
                        }
                    }
                     if(!found){
                         return true;
                     }    
                }
            }
            return false;    
        }

        function checkCollisionLeft(piece,arena){
            var val=Object.values(piece);
            var found = false;
            for(var i=0;i<4;i++){
                if(arena[val[i].x][val[i].y-1] == 1 ){
                    for(var j=0;j<4;j++){
                        if((val[i].y-1 == val[j].y && val[i].x == val[j].x)){
                            found=true;
                            break;
                        }else{
                            found=false;
                        }
                    }
                     if(!found){
                         return true;
                     }    
                }
            }
            return false;    
        }

        function checkCollision(piece,arena){
            var val=Object.values(piece);
            var found = false;
            for(var i=0;i<4;i++){
                if(arena[val[i].x+1][val[i].y]==1){
                    for(var j=0;j<4;j++){
                        if(val[i].x+1 == val[j].x && val[i].y == val[j].y){
                            found=true;
                            break;
                        }else{
                            found=false;
                        }
                    }
                     if(!found){
                         return true;
                     }    
                }
            }
            return false;    
        }

        function rotate90Clockwise(a){
            N=4;
            for (var i = 0; i < N / 2; i++){
                for (var j = i; j < N - i - 1; j++){
                    var temp = a[i][j];
                    a[i][j] = a[N - 1 - j][i];
                    a[N - 1 - j][i] = a[N - 1 - i][N - 1 - j];
                    a[N - 1 - i][N - 1 - j] = a[j][N - 1 - i];
                    a[j][N - 1 - i] = temp;
                }
            }
        }

        function rotate(pieceMatrix,arena){
            document.addEventListener('keydown',event=>{
                if(event.keyCode==32){
                    rotate90Clockwise(pieceMatrix);

                    arena[piece.pos1.x][piece.pos1.y]=0;
                    arena[piece.pos2.x][piece.pos2.y]=0;
                    arena[piece.pos3.x][piece.pos3.y]=0;
                    arena[piece.pos4.x][piece.pos4.y]=0;

                    boxes[piece.pos1.x][piece.pos1.y].setEnabled(false);
                    boxes[piece.pos2.x][piece.pos2.y].setEnabled(false);
                    boxes[piece.pos3.x][piece.pos3.y].setEnabled(false);
                    boxes[piece.pos4.x][piece.pos4.y].setEnabled(false);

                    var helperPiece={
                        pos1: {x:0,y:0},
                        pos2: {x:0,y:0},
                        pos3: {x:0,y:0},
                        pos4: {x:0,y:0},
                    };
                    getPieceCoordinates(pieceMatrix,helperPiece,0,0);
                    
                    if(positionPiece(helperPiece,arena,0,0) != false){
                        getPieceCoordinates(pieceMatrix,piece,0,0);
                        renderArena(arena,boxes);
                    }else{
                        arena[piece.pos1.x][piece.pos1.y]=1;
                        arena[piece.pos2.x][piece.pos2.y]=1;
                        arena[piece.pos3.x][piece.pos3.y]=1;
                        arena[piece.pos4.x][piece.pos4.y]=1;

                        boxes[piece.pos1.x][piece.pos1.y].setEnabled(true);
                        boxes[piece.pos2.x][piece.pos2.y].setEnabled(true);
                        boxes[piece.pos3.x][piece.pos3.y].setEnabled(true);
                        boxes[piece.pos4.x][piece.pos4.y].setEnabled(true);
                    }
                    
                }

            })
        }

        if(!checkGameOver(piece,arena)){
            myVar = setInterval(moveDown, 1000,arena,piece,boxes);
            currentPiece = newPiece(pieces);
            getPieceCoordinates(currentPiece,piece,0,0);
            positionPiece(piece,arena,0,0);
            renderArena(arena,boxes);
            rotate(currentPiece,arena);
            moveHorizontally(piece,arena,boxes);

            scene.registerBeforeRender(function(){
                
           });
        }else{
            console.log("Game Over");
        }
        return scene;
    }

    var scene = createScene();
    engine.runRenderLoop(function(){
        scene.render();
    });
    
})

