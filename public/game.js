var ChessGame = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function ChessGame ()
    {
        Phaser.Scene.call(this, { key: 'ChessGame' });
        this.currentPlayer = 1; // Player 1 starts the game
        this.rookDragging = false; // Flag to track if the rook is being dragged
    },

    preload: function ()
    {
        this.load.image('chessboard', 'https://res.cloudinary.com/dwpdohhlx/image/upload/v1711446267/iPhone_8_-_415_myfn9h.png');
        this.load.image('squares','https://res.cloudinary.com/dwpdohhlx/image/upload/v1711446305/Squares_ucmugb.png')
        this.load.image('rook', 'https://res.cloudinary.com/dwpdohhlx/image/upload/v1711446339/Group_77793_l7laan.png');
        this.load.image('me',"https://res.cloudinary.com/dwpdohhlx/image/upload/v1711446208/Frame_11_mfhszk.png")
        this.load.image('oppositePerson','https://res.cloudinary.com/dwpdohhlx/image/upload/v1711446879/Group_77757_o8frq2.png')
        this.load.image('target','https://res.cloudinary.com/dwpdohhlx/image/upload/v1711446942/Group_77810_q2fjlc.png')
    },

    create: function ()
    {
        this.add.image(400, 300, 'chessboard'); // Adjust position as needed
        this.squares = this.add.sprite(400,300,'squares').setInteractive();
        this.rook = this.add.sprite(550, 150, 'rook');
        this.target = this.add.sprite(250,450,'target');
        this.oppositePerson = this.add.sprite(400,550,'oppositePerson');
        this.me = this.add.sprite(400,50,'me');
        // Enable pointer events for the rook
        this.rook.setInteractive();
        this.input.setDraggable(this.rook);

        // Handle drag start and end events on the rook
        this.input.on('dragstart', function (pointer, gameObject) {
            this.rookDragging = true;
        }, this);

        this.input.on('dragend', function (pointer, gameObject) {
            this.rookDragging = false;
        }, this);

        // Handle player input on the chessboard
        this.input.on('pointerdown', this.onChessboardClick, this);
    },

    update: function ()
    {
        // Check if the rook is being dragged and update its position
        if (this.rookDragging) {
            this.rook.x = this.input.x;
            this.rook.y = this.input.y;
        }
    },

    onChessboardClick: function (pointer, gameObject)
    {
        // Check if the clicked object is the chessboard
        if (gameObject === this.squares) {
            // Move the rook to the clicked position
            this.rook.setPosition(pointer.x, pointer.y);
        }
    }

});

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: ChessGame
};

var game = new Phaser.Game(config);
