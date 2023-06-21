<template>
    <div class="toolbar" id="toolbar_id" @dblclick="$event => postMessage('sysfun', 'MaxWnd')">
        <button class="toolbar-button" @mousedown.stop @click="$event => postMessage('sysfun', 'MiniWnd')"><el-icon
                size="15px">
                <Minus />
            </el-icon>
        </button>
        <button class="toolbar-button" @mousedown.stop @click="$event => postMessage('sysfun', 'MaxWnd')"><el-icon
                size="15px">
                <FullScreen />
            </el-icon>
        </button>
        <button class="toolbar-button" id="close" @mousedown.stop
            @click="$event => postMessage('sysfun', 'CloseWnd')"><el-icon size="15px">
                <Close />
            </el-icon>
        </button>
    </div>
</template>
    
<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import { enbaleWndMove, enbaleWndSize } from '../utils/wndFunc';
import { postMessage } from '../utils/postMessage';


onMounted(() => {
    enbaleWndMove("toolbar_id", true, 3);
    enbaleWndSize(true, 3);
})


</script>
    
<style>
.toolbar {
    display: flex;
    justify-content: flex-end;
    background: #606060;

}

.toolbar-button {
    width: 30px;
    height: 30px;
    background-color: rgba(255, 255, 255, 0);
    border: none;
    cursor: pointer;
    margin-left: 10px;
    /* transition: background-color 0.2s ease-out; */
}

.toolbar-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.toolbar-button .el-icon {
    color: #fff;
    size: 15px;
}


.el-button {
    background-color: transparent;
    color: inherit;
    border: none;
    box-shadow: none;
    padding: 0;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    text-align: inherit;
    text-decoration: none;
    cursor: pointer;
    outline: none;
}


.el-button:focus:not(:active) {
    outline: none;
    box-shadow: none;
}

#close:hover {
    background-color: red;

}
</style>