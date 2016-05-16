'use strict';

function FlickrAPI () {
    var self = this;
    self._url = 'https://api.flickr.com/services/rest/';
    self._apiKey = '255a43d745050cc6ce42d84effb35f96';
    self._reqObj = {
                        method: 'flickr.photos.search',
                        api_key: self._apiKey,
                        text: '',
                        format: 'json',
                        nojsoncallback: 1,
                        page: 0
                    };
};

FlickrAPI.prototype.search = function (keyword) {
    var self = this;
    if (self._reqObj.text === keyword) {
        self._reqObj.page++;
    } else {
        self._reqObj.text = keyword;
        self._reqObj.page = 1;
    }
    return self._reqObj;
};

FlickrAPI.prototype.imageDataGenerator = function (data, imageDataModel) {
    var self = this;
    var photoData = data.photos, photos = photoData.photo;
    var base_url, image_url, thumb_url;
    var imageData = [];

    for (var i = 0; i < photos.length; i++) {
        if (photos[i] && Object.keys(photos[i]).length > 0) {
            base_url = 'https://farm' + photos[i].farm + '.staticflickr.com/' + 
                        photos[i].server + '/' + photos[i].id + '_' + photos[i].secret;
            image_url = base_url + '.jpg';
            thumb_url = base_url + '_q.jpg';
            
            var newImageData = JSON.parse(JSON.stringify(imageDataModel));
            newImageData.title = photos[i].title;
            newImageData.imageSrc = image_url;
            newImageData.thumbSrc = thumb_url;
            imageData.push(newImageData);
        }
    }

    return imageData;
};

module.exports.FlickrAPI = FlickrAPI;
