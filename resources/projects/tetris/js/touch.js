$(document).ready(function() {
    var mc = new Hammer(document.getElementById('canvas'), {
        drag_lock_to_axis: true
    });

    mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    mc.on('pan', function(event) {
        event.preventDefault();
    });

    mc.on('panleft', function (e) {
        if (e.isFinal) {
            shiftBlock(currentBlock, -1);
        }
    });

    mc.on('panright', function (e) {
        if (e.isFinal) {
            shiftBlock(currentBlock, +1);
        }
    });

    mc.on('tap', function (e) {
        rotateBlock(currentBlock);
    });

    mc.on('pandown', function (e) {
        if (e.velocityY < - 0.5) {
            fasterDown = 0.1;
        }
    });

});
