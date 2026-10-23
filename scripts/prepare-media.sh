#!/usr/bin/env bash
# Builds web sized media in public/media/ from the owner's originals.
# Originals are never modified. Re-run after swapping a source file.
# Needs: sips (macOS), ffmpeg and exiftool.
set -euo pipefail
cd "$(dirname "$0")/.."
SRGB="/System/Library/ColorSync/Profiles/sRGB Profile.icc"
SRC_IMG=public/media/images
SRC_VID=public/media/videos
OUT=public/media

# photo <source> <output name> [long edge px] [rotate degrees]
# Rotation is explicit per file: some sources carry a rotate tag over landscape pixels (rotate),
# others carry the same tag over pixels that are already upright (do not rotate).
photo() {
  # Convert iPhone Display P3 to sRGB first, so colours stay right once the profile is stripped
  # Never upscale: cap the long edge at the source's own size (some owner photos are small)
  local w h edge="${3:-2000}"
  w=$(sips -g pixelWidth "$SRC_IMG/$1" | awk '/pixelWidth/{print $2}')
  h=$(sips -g pixelHeight "$SRC_IMG/$1" | awk '/pixelHeight/{print $2}')
  [ "$w" -gt "$h" ] && long=$w || long=$h
  [ "$long" -lt "$edge" ] && edge=$long
  sips -s format jpeg -s formatOptions 78 -Z "$edge" --matchTo "$SRGB" "$SRC_IMG/$1" --out "$OUT/$2" >/dev/null
  if [ -n "${4:-}" ]; then sips -r "$4" "$OUT/$2" >/dev/null; fi
  # Strip all metadata: removes GPS location and camera data before publishing, and drops
  # stale orientation tags (IMG_8363 is stored upright but tagged "rotate 90", which browsers obey).
  exiftool -q -q -overwrite_original -all= "$OUT/$2"
  echo "  $2 ($(du -h "$OUT/$2" | cut -f1))"
}

echo "Hero"
# Drone orbit of the yacht at anchor (1001.mp4, landscape 2560x1440, 36 s, 136 MB).
# First 16 s only (the orbit around the boat), 1600 wide, 30 fps, no audio: a light loop.
ffmpeg -loglevel error -y -t 16 -i "$SRC_VID/1001.mp4" \
  -vf "scale=1600:-2,fps=30" -map_metadata -1 -an -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart "$OUT/hero.mp4"
# Poster is the first frame, so the swap from still to video is invisible.
ffmpeg -loglevel error -y -i "$OUT/hero.mp4" -frames:v 1 -q:v 3 "$OUT/hero.jpg"
echo "  hero.mp4 ($(du -h "$OUT/hero.mp4" | cut -f1)), hero.jpg"

echo "Comparison, yacht side (a day on board)"
photo IMG_3523.jpg yacht-cove.jpg 1600
photo IMG_8363.jpg yacht-swim.jpg 1600
photo IMG_8684.jpg yacht-anchorage.jpg 1600
photo IMG_8445.jpg yacht-sail.jpg 1600
photo IMG_8549.jpg yacht-sunset.jpg 1600
photo IMG_8734.HEIC yacht-night.jpg 1600

echo "Gallery"
photo IMG_8679.jpg gallery-cove.jpg 2400
photo IMG_8364.jpg gallery-cockpit.jpg 1600
photo IMG_8561.jpg gallery-helm.jpg 1600
photo IMG_8770.HEIC gallery-dinner.jpg 1600
# Trimmed to the stretch with dolphins in frame; played only when the visitor taps it
ffmpeg -loglevel error -y -ss 5 -t 12 -i "$SRC_VID/moments-dolphins.mp4" \
  -vf "scale=540:-2,fps=30" -map_metadata -1 -an -c:v libx264 -preset slow -crf 31 -pix_fmt yuv420p -movflags +faststart \
  "$OUT/gallery-dolphins.mp4"
# Poster at the moment a dolphin is in frame
ffmpeg -loglevel error -y -ss 6 -i "$OUT/gallery-dolphins.mp4" -frames:v 1 -q:v 3 "$OUT/gallery-dolphins.jpg"
echo "  gallery-dolphins.mp4 ($(du -h "$OUT/gallery-dolphins.mp4" | cut -f1)), gallery-dolphins.jpg"

echo "Occasions"
# Portrait clip for the bachelor party panel (4:5 frame); autoplays muted only while in view
ffmpeg -loglevel error -y -i "$SRC_VID/bachelor-party.mp4" \
  -vf "scale=720:-2,fps=30" -map_metadata -1 -an -c:v libx264 -preset slow -crf 29 -pix_fmt yuv420p -movflags +faststart \
  "$OUT/occasion-bachelor.mp4"
ffmpeg -loglevel error -y -i "$OUT/occasion-bachelor.mp4" -frames:v 1 -q:v 3 "$OUT/occasion-bachelor.jpg"
echo "  occasion-bachelor.mp4 ($(du -h "$OUT/occasion-bachelor.mp4" | cut -f1)), occasion-bachelor.jpg"

echo "Deck plan (real layout, Bavaria 46)"
# Trim the white margin around the drawing (measured content box 150,221 → 650,379, plus 12px)
sips --cropOffset 209 138 --cropToHeightWidth 182 524 "$OUT/bavaria-46-cabins.jpg" --out "$OUT/deck-plan.jpg" >/dev/null
exiftool -q -q -overwrite_original -all= "$OUT/deck-plan.jpg"
echo "  deck-plan.jpg"

echo "The boat (owner photos of the Bavaria 46, 2026-10-23; pixels upright, no rotation)"
photo boat-lesvos-mitilini.jpg boat-moored.jpg 2400
photo boat-P1140712.jpg boat-marina.jpg 1600
photo boat-IMG_20190429_170900.jpg boat-stern.jpg 1600
photo boat-IMG_2448.jpg boat-deck.jpg 1600
photo boat-20220516_140904.jpg boat-saloon.jpg 1600
photo boat-P_20180617_171555.jpg boat-saloon-wide.jpg 1600
photo boat-received_10210748209439120.jpg boat-saloon-table.jpg 1600
photo boat-P_20170423_150334.jpg boat-cabin-forward.jpg 1600
photo boat-P_20170423_152918.jpg boat-cabin-double.jpg 1600
photo boat-P_20170423_190025.jpg boat-cabin-bunks.jpg 1600
photo boat-P_20170423_190046.jpg boat-cabin-bunks-2.jpg 1600
photo boat-P_20170423_192757.jpg boat-galley.jpg 1600
photo boat-P_20170423_193716.jpg boat-bathroom.jpg 1600
photo boat-P_20170423_195107.jpg boat-bathroom-2.jpg 1600

echo "Trainings (owner clips and photos with action, 2026-10-23)"
# train_clip <source> <name> <start s> <length s> <poster time s, within the trimmed clip>
# Portrait phone clips: ffmpeg applies the rotation flag. 720 wide, 30 fps, muted, no metadata.
train_clip() {
  ffmpeg -loglevel error -y -ss "$3" -t "$4" -i "$SRC_VID/$1" \
    -vf "scale=720:-2,fps=30" -map_metadata -1 -an -c:v libx264 -preset slow -crf 29 -pix_fmt yuv420p -movflags +faststart \
    "$OUT/$2.mp4"
  ffmpeg -loglevel error -y -ss "$5" -i "$OUT/$2.mp4" -frames:v 1 -q:v 3 "$OUT/$2.jpg"
  echo "  $2.mp4 ($(du -h "$OUT/$2.mp4" | cut -f1)), $2.jpg"
}
train_clip train-IMG_7674.MOV train-heel 0 21 13.5
train_clip train-IMG_6087.MOV train-waves 0 14 2.5
train_clip train-IMG_7675.MOV train-bow 0 12.5 1.5
train_clip train-IMG_7677.MOV train-helm 0 14 3
train_clip train-IMG_2730.MOV train-sails 0 12 2
# These HEICs are tagged "rotate 90 CW" over landscape pixels
photo train-IMG_5920.HEIC train-flag.jpg 1600 90
photo train-IMG_7676.HEIC train-heeling.jpg 1600 90

echo "Shared by our guests"
# Guest photos (second batch, dropped straight into public/media)
# These HEICs are tagged "rotate 90" over landscape pixels
SRC_IMG=$OUT photo IMG_3594.HEIC guest-sunset-anchor.jpg 1400 90
SRC_IMG=$OUT photo IMG_3669.HEIC guest-helm.jpg 1400 90
SRC_IMG=$OUT photo IMG_3704.HEIC guest-sunset-sea.jpg 1400 90
# Screenshot from a guest's video: crop the dark gradient bars (photo rows 540 → 2256)
ffmpeg -loglevel error -y -i "$OUT/IMG_3874.PNG" -vf "crop=1290:1716:0:540,scale=720:-2" -q:v 3 "$OUT/guest-dolphins.jpg"
echo "  guest-dolphins.jpg"
# guest_clip <source> <name> <poster time s>: portrait, 540 wide, muted, no metadata.
# ffmpeg applies the phone's rotation flag, so the clips come out upright.
guest_clip() {
  ffmpeg -loglevel error -y -i "$OUT/$1" -vf "scale=540:-2,fps=30" -map_metadata -1 -an \
    -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart "$OUT/$2.mp4"
  ffmpeg -loglevel error -y -ss "$3" -i "$OUT/$2.mp4" -frames:v 1 -q:v 3 "$OUT/$2.jpg"
  echo "  $2.mp4 ($(du -h "$OUT/$2.mp4" | cut -f1)), $2.jpg"
}
guest_clip IMG_3412.MOV guest-dive 1
guest_clip IMG_3601.MOV guest-sup 6
guest_clip IMG_8615.MOV guest-anchorage 1
guest_clip IMG_8750.MOV guest-harbour 1

echo "Cruise lead photos (slot 1: page gallery and list thumbnail)"
# cruise_photo <source> <slug>: sRGB, metadata stripped, long edge capped at 1600 but never enlarged
cruise_photo() {
  local src="$SRC_IMG/$1" out="$OUT/cruise-$2-1.jpg"
  local long; long=$(sips -g pixelWidth -g pixelHeight "$src" | awk '/pixel/{print $2}' | sort -n | tail -1)
  local size=$(( long < 1600 ? long : 1600 ))
  sips -s format jpeg -s formatOptions 82 -Z "$size" --matchTo "$SRGB" "$src" --out "$out" >/dev/null
  exiftool -q -q -overwrite_original -all= "$out"
  echo "  cruise-$2-1.jpg ($(sips -g pixelWidth -g pixelHeight "$out" | awk '/pixel/{printf $2"x"}' | sed 's/x$//'))"
}
cruise_photo 1-day-tasos.jpg thasos-bays-day-cruise
cruise_photo kavala-trip.jpeg kavala-day-cruise
cruise_photo tasos-2-3-days.jpg thasos-cruise
cruise_photo sporades.jpg sporades-cruise
cruise_photo halkidki.jpg halkidiki-cruise
# TODO(owner): photos for tuna-fishing-trip and the two courses

echo "Photo library, batch of 2026-10-08 (owner's trip photos)"
BATCH="$SRC_IMG/batch-2026-10-08"
SRC_IMG=$BATCH photo greece-1.jpg pic-green-bay.jpg 1600
SRC_IMG=$BATCH photo greece-bay.jpg pic-turquoise-bay.jpg 1600
SRC_IMG=$BATCH photo greece-bay-2.jpg pic-turquoise-deck.jpg 1600
SRC_IMG=$BATCH photo greece-bay-3.jpg pic-beach-harbour.jpg 1600
SRC_IMG=$BATCH photo greece-bay-4.jpg pic-green-cove.jpg 1600
SRC_IMG=$BATCH photo greece-bay-5.jpg pic-bay-flag.jpg 1600
SRC_IMG=$BATCH photo greece-bay-6.jpg pic-open-sea-deck.jpg 1600
SRC_IMG=$BATCH photo greece-bay-thasos.jpg pic-thasos-bay.jpg 1600
SRC_IMG=$BATCH photo greece-giola.jpg pic-giola.jpg 1600
SRC_IMG=$BATCH photo greece-giola-2.jpg pic-giola-2.jpg 1600
SRC_IMG=$BATCH photo greece-alonisos-island-view.jpg pic-alonissos-view.jpg 1600
SRC_IMG=$BATCH photo greece-alonisos-island.jpg pic-alonissos-alley.jpg 1600
SRC_IMG=$BATCH photo greece-alonisos-isalnd5.jpg pic-alonissos-sunset-alley.jpg 1600
SRC_IMG=$BATCH photo greece-alonisos-island-2.jpg pic-alonissos-steps.jpg 1600
SRC_IMG=$BATCH photo greece-alonisos-island-3.jpg pic-alonissos-church-lane.jpg 1600
SRC_IMG=$BATCH photo greece-alonisos-island-4.jpg pic-alonissos-bougainvillea.jpg 1600
SRC_IMG=$BATCH photo greece-skopelos.jpg pic-skopelos-harbour.jpg 1600
SRC_IMG=$BATCH photo greece-skopelos-2.jpg pic-skopelos-church.jpg 1600
SRC_IMG=$BATCH photo greece-kira-panagia.jpg pic-kyra-panagia.jpg 1600
SRC_IMG=$BATCH photo greece-island.jpg pic-island-taverna.jpg 1600
SRC_IMG=$BATCH photo greece-island-4.jpg pic-island-lane.jpg 1600
SRC_IMG=$BATCH photo greece-island-white-house.jpg pic-island-white-house.jpg 1600
SRC_IMG=$BATCH photo greece-view-from-island.jpg pic-island-sunset-view.jpg 1600
SRC_IMG=$BATCH photo greece-view-island-2.jpg pic-village-evening.jpg 1600
SRC_IMG=$BATCH photo greece-view-from-boat-athos-mountain.jpg pic-athos.jpg 1600
SRC_IMG=$BATCH photo greece-fishing-tuna-2.jpg pic-tuna-catch.jpg 1600
SRC_IMG=$BATCH photo greece-fishing-tuna.jpg pic-tuna-deck.jpg 1600
# greece-bay-3.mp4 (portrait, 21 s): two clips. Paddle boarding at anchor (0 to 12 s) and life in the cockpit (16 s to the end).
ffmpeg -loglevel error -y -t 12 -i "$BATCH/greece-bay-3.mp4" -vf "scale=540:-2,fps=30" -map_metadata -1 -an \
  -c:v libx264 -preset slow -crf 29 -pix_fmt yuv420p -movflags +faststart "$OUT/pic-sup-paddle.mp4"
ffmpeg -loglevel error -y -ss 3 -i "$OUT/pic-sup-paddle.mp4" -frames:v 1 -q:v 3 "$OUT/pic-sup-paddle.jpg"
ffmpeg -loglevel error -y -ss 16 -i "$BATCH/greece-bay-3.mp4" -vf "scale=540:-2,fps=30" -map_metadata -1 -an \
  -c:v libx264 -preset slow -crf 29 -pix_fmt yuv420p -movflags +faststart "$OUT/pic-cockpit-life.mp4"
ffmpeg -loglevel error -y -ss 1.5 -i "$OUT/pic-cockpit-life.mp4" -frames:v 1 -q:v 3 "$OUT/pic-cockpit-life.jpg"
echo "  pic-sup-paddle.mp4 ($(du -h "$OUT/pic-sup-paddle.mp4" | cut -f1)), pic-cockpit-life.mp4 ($(du -h "$OUT/pic-cockpit-life.mp4" | cut -f1))"

echo "Yoga and pilates (batch of 2026-10-22)"
# yoga-on-yacht is only 450 px wide: used as a small inset, never large
SRC_IMG="$SRC_IMG/batch-2026-10-22" photo pilates-on-yacht.jpg pic-pilates.jpg 1440
SRC_IMG="$SRC_IMG/batch-2026-10-22" photo yoga-on-yacht.jpg pic-yoga.jpg 450

echo "Social sharing image"
sips -s format jpeg -s formatOptions 80 --resampleWidth 1200 --matchTo "$SRGB" "$SRC_IMG/IMG_8679.jpg" --out "$OUT/og.jpg" >/dev/null
sips --cropToHeightWidth 630 1200 "$OUT/og.jpg" >/dev/null
exiftool -q -q -overwrite_original -all= "$OUT/og.jpg"
echo "  og.jpg"
