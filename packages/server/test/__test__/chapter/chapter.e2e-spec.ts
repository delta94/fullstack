import { testCreateChapter } from './create-chapter';
import { testUpdateChapter } from './update-chapter';
import { testDeleteChapter } from './delete-chapter';
import { testGetChapters } from './get-chapters';
import { testGetChapter, testGetChapterByNo } from './get-chapter';
import { testPublicChapter } from './public-chapter';

describe('ChapterController (e2e)', () => {
  describe('(POST) Create Chapter', testCreateChapter);
  describe('(PTCH) Update Chapter', testUpdateChapter);
  describe('(DEL)  Delete Chapter', testDeleteChapter);
  describe('(GET)  Get Chapters', testGetChapters);
  describe('(GET)  Get Chapter', testGetChapter);
  describe('(GET)  Get Chapter By Number', testGetChapterByNo);
  describe('(POST) Public Chapter', testPublicChapter);
});
