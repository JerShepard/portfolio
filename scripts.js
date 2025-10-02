let lightbox = document.getElementById('lightbox');
let lightboxImg = document.getElementById('lightbox-img');
let currentImageIndex = 0;
let currentGroup = [];
 
function openLightbox(index, groupName) {
  // загружаем список картинок для этой группы
  currentGroup = getImagesByGroup(groupName);
  currentImageIndex = index;
  lightbox.style.display = 'flex';
  lightboxImg.src = currentGroup[index];
}
 
function closeLightbox() {
  lightbox.style.display = 'none';
}
 
function changeImage(dir) {
  currentImageIndex = (currentImageIndex + dir + currentGroup.length) % currentGroup.length;
  lightboxImg.src = currentGroup[currentImageIndex];
}
 
// сюда вручную подставляем массивы для проектов
function getImagesByGroup(groupName) {
  if (groupName === '3d_Blade') {
    return [
      'images/3d_Blade/blade_1.png',
      'images/3d_Blade/blade_2.png',
      'images/3d_Blade/blade_3.png'
    ];
  }
  if (groupName === 'neonCash') {
    return [
      'images/neonCash/bgRegular.jpg',
      'images/neonCash/bgFree.jpg'
    ];
  }
  if (groupName === 'UI') {
    return [
      'images/UI/UI.png'
    ];
  }
  if (groupName === '2Darts') {
    return [
      'images/2Darts/rock.jpg',
      'images/2Darts/wood.jpg',
      'images/2Darts/metal.jpg'
    ];
  }
  if (groupName === '3D_continue') {
    return [
      'images/3D_continue/deer.jpg',
      'images/3D_continue/robot.jpg',
      'images/3D_continue/maya.jpg'
    ];
  }
  if (groupName === 'presentation') {
    return [
      'images/presentation/App_DnD_1.png',
      'images/presentation/App_DnD_2.png',
      'images/presentation/App_DnD_3.png'
    ];
  }
  return [];
}
