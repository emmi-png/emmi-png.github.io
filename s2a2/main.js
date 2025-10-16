document.addEventListener('DOMContentLoaded', ()=>{
  let focusedPlayer = null;

  function createFocusedPlayer(imgSrc, audioSrc){
    // remove existing
    removeFocusedPlayer();

    const container = document.createElement('div');
    container.className = 'focused-player';

    const card = document.createElement('div');
    card.className = 'player-card';

    const discWrap = document.createElement('div');
    discWrap.className = 'player-disc';
    const img = document.createElement('img');
    img.src = imgSrc;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    discWrap.appendChild(img);
    // Don't auto-spin - only spin when playing
    // discWrap.classList.add('spin');
    
    // Create tonearm and base elements with proper grouping
    const tonearmContainer = document.createElement('div');
    tonearmContainer.className = 'tonearm-container';
    
    // Create the group container that positions both tonearm and base together
    const tonearmGroup = document.createElement('div');
    tonearmGroup.className = 'tonearm-group';
    
    const base = document.createElement('div');
    base.className = 'tonearm-base';
    const baseImg = document.createElement('img');
    baseImg.src = 'base.png';
    baseImg.alt = 'Tonearm base';
    base.appendChild(baseImg);
    
    const tonearm = document.createElement('div');
    tonearm.className = 'tonearm';
    const tonearmImg = document.createElement('img');
    tonearmImg.src = 'tonearm.png';
    tonearmImg.alt = 'Tonearm';
    tonearmImg.onerror = function() {
      console.log('Tonearm image failed to load');
      // Add a fallback background color if image fails
      tonearm.style.background = 'rgba(200, 200, 200, 0.8)';
      tonearm.style.border = '1px solid #ccc';
    };
    tonearmImg.onload = function() {
      console.log('Tonearm image loaded successfully');
    };
    tonearm.appendChild(tonearmImg);
    tonearm.style.transformOrigin = '50% 5%'; 
    
    // Add base and tonearm to the group
    tonearmGroup.appendChild(base);
    tonearmGroup.appendChild(tonearm);
    
    // Add the group to the container
    tonearmContainer.appendChild(tonearmGroup);
    
    // Add tonearm to the player card (outside the spinning disc)
    card.appendChild(tonearmContainer);

  // Create the song info block (the rectangular block below the record)
  const songInfoBlock = document.createElement('div');
  songInfoBlock.className = 'song-info-block';
  
  // Album art thumbnail (left side)
  const albumArt = document.createElement('div');
  albumArt.className = 'song-album-art';
  const thumbnail = document.createElement('img');
  thumbnail.src = imgSrc;
  thumbnail.alt = 'Album art';
  albumArt.appendChild(thumbnail);
  
  // Song details (middle)
  const songDetails = document.createElement('div');
  songDetails.className = 'song-details';
  const title = document.createElement('div');
  title.className = 'song-title';
  const artist = document.createElement('div');
  artist.className = 'song-artist';
  songDetails.appendChild(title);
  songDetails.appendChild(artist);
  
  // Control icons (right side)
  const controlIcons = document.createElement('div');
  controlIcons.className = 'song-control-icons';
  
  // Pause icon
  const pauseIcon = document.createElement('div');
  pauseIcon.className = 'control-icon pause-icon';
  pauseIcon.innerHTML = '⏸';
  
  // External link icon
  const externalIcon = document.createElement('div');
  externalIcon.className = 'control-icon external-icon';
  externalIcon.innerHTML = '⧉';
  
  controlIcons.appendChild(pauseIcon);
  controlIcons.appendChild(externalIcon);
  
  // Assemble the song info block
  songInfoBlock.appendChild(albumArt);
  songInfoBlock.appendChild(songDetails);
  songInfoBlock.appendChild(controlIcons);

  const controls = document.createElement('div');
  controls.className = 'player-controls';
  const toggle = document.createElement('button');
  toggle.className = 'player-toggle';
  toggle.textContent = 'Play';
  toggle.setAttribute('aria-pressed','false');
  controls.appendChild(toggle);

    const audio = document.createElement('audio');
    audio.className = 'player-audio';
    audio.preload = 'auto';
    audio.src = audioSrc;

  card.appendChild(discWrap);
  card.appendChild(songInfoBlock);
  card.appendChild(controls);
    card.appendChild(audio);
    container.appendChild(card);

    // insert before grid
    const wrap = document.querySelector('.wrap');
    const grid = document.querySelector('.grid');
    wrap.insertBefore(container, grid);

  // dim siblings
  document.querySelectorAll('.album').forEach(a=>a.classList.add('is-dim'));
  // indicate page is in focused-only-record mode
  document.body.classList.add('only-record');
    // undim the source album later via data attribute handled by caller

    // Track playing state manually for reliable toggling
    let isCurrentlyPlaying = false;

    // Function to handle play/pause logic
    const handlePlayPause = (isPlaying) => {
      if(isPlaying){
        // Start playing
        audio.play();
        isCurrentlyPlaying = true;
        container.isCurrentlyPlaying = true;
        toggle.classList.add('playing');
        toggle.setAttribute('aria-pressed','true');
        toggle.textContent = 'Pause';
        // Start disc spinning and move tonearm to playing position
        discWrap.classList.add('spin');
        tonearm.classList.add('playing');
      } else {
        // Stop playing
        audio.pause();
        isCurrentlyPlaying = false;
        container.isCurrentlyPlaying = false;
        toggle.classList.remove('playing');
        toggle.setAttribute('aria-pressed','false');
        toggle.textContent = 'Play';
        // Stop disc spinning and return tonearm to rest position
        discWrap.classList.remove('spin');
        tonearm.classList.remove('playing');
      }
    };

    // wire toggle button
    toggle.addEventListener('click', ()=>{
      if(!audio.src) return;
      handlePlayPause(!isCurrentlyPlaying);
    });

    // wire pause icon in song info block
    pauseIcon.addEventListener('click', ()=>{
      if(!audio.src) return;
      handlePlayPause(!isCurrentlyPlaying);
    });

    // wire tonearm click to toggle play/pause
    tonearm.addEventListener('click', ()=>{
      if(!audio.src) return;
      handlePlayPause(!isCurrentlyPlaying);
    });

    // Expose the playing state on the container for external access
    container.isCurrentlyPlaying = false;
    container.updatePlayingState = (playing) => {
      isCurrentlyPlaying = playing;
      container.isCurrentlyPlaying = playing;
    };

    focusedPlayer = container;
    return container;
  }

  function removeFocusedPlayer(){
    if(focusedPlayer){
      const audio = focusedPlayer.querySelector('audio');
      if(audio){ audio.pause(); audio.src = ''; }
      focusedPlayer.remove();
      focusedPlayer = null;
    }
    document.querySelectorAll('.album').forEach(a=>a.classList.remove('is-dim'));
    // remove focused-only view class
    document.body.classList.remove('only-record');
  }

  // wire album clicks (click anywhere on the album to focus)
  document.querySelectorAll('.album').forEach(album =>{
    const sleeve = album.querySelector('.sleeve img');
    const audio = album.dataset.audio; // path
    if(audio){
      album.addEventListener('click', (e)=>{
        // avoid reacting to clicks on interactive elements inside if any
        if(e.target.closest('.player-controls')) return;
        // determine which image to use: if the click was on the record, prefer the record image
        const recordImgEl = e.target.closest('.record') ? e.target.closest('.record').querySelector('img') : null;
        const chosenImgSrc = recordImgEl && recordImgEl.src ? recordImgEl.src : sleeve.src;

        // if already focused on this album/image, close
        if(focusedPlayer && focusedPlayer.querySelector('img') && focusedPlayer.querySelector('img').src === chosenImgSrc){
          removeFocusedPlayer();
          return;
        }
        removeFocusedPlayer();
        const player = createFocusedPlayer(chosenImgSrc, audio);
        // set metadata if present
        const title = album.dataset.trackTitle || '';
        const artist = album.dataset.trackArtist || '';
        const songInfoBlock = player.querySelector('.song-info-block');
        if(songInfoBlock){
          songInfoBlock.querySelector('.song-title').textContent = title;
          songInfoBlock.querySelector('.song-artist').textContent = artist;
        }
        // auto-play
        const audioEl = player.querySelector('audio');
        const tonearmEl = player.querySelector('.tonearm');
        audioEl.play().then(()=>{
          const btn = player.querySelector('.player-toggle');
          const discWrap = player.querySelector('.player-disc');
          btn.classList.add('playing');
          btn.textContent = 'Pause';
          discWrap.classList.add('spin');
          if(tonearmEl) tonearmEl.classList.add('playing');
          // Update the manual state tracking
          if(player.updatePlayingState) {
            player.updatePlayingState(true);
          }
        }).catch(()=>{
          // autoplay blocked; leave paused
        });
        // undim this album
        album.classList.remove('is-dim');
        // scroll into view center
        player.scrollIntoView({behavior:'smooth',block:'center'});
      });
    }
  });

  // click outside to remove
  document.addEventListener('click', (e)=>{
    if(focusedPlayer && !focusedPlayer.contains(e.target) && !e.target.closest('.record')){
      removeFocusedPlayer();
    }
  });
});
