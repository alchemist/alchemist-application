import Vue from "vue";

Vue.filter('truncate', function(value, length) {
    if(value.length < length) {
        return value;
    }

    length = length - 3;

    return value.substring(0, length) + '...';
});