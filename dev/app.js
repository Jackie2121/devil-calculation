(function () {
  'use strict';

  const E = window.DevilEngine;
  if (!E) {
    document.body.textContent = 'Calculation engine failed to load. / 计算引擎加载失败，请刷新页面。';
    return;
  }

  const STORAGE_KEY = 'devilCalcNBack.v1';
  const $ = (id) => document.getElementById(id);
  const pad2 = (value) => String(value).padStart(2, '0');

  const I18N = {
    zh: {
      brand: `魔鬼计算`,
      nav_log: `记录`,
      nav_help: `怎么玩`,
      brand_home_aria: `返回首页`,
      theme_dark_aria: `切换到深色主题`,
      theme_light_aria: `切换到浅色主题`,
      lang_switch_en: `切换到英文`,
      lang_switch_zh: `切换到中文`,
      hero_eyebrow: `WORKING MEMORY · 心算训练`,
      hero_title_html: `记住 N 题前，<br><em>而不是眼前。</em>`,
      hero_lede_html: `一边计算新题，一边回溯旧答案。当前算式只是干扰项，<br class="desktop-break">真正要输的是 N 题之前那道题的答案。`,
      tag_round_html: `<b>25</b> 题 / 局`,
      tag_back_html: `<b>1–5</b> 回溯`,
      tag_ops_html: `<b>4</b> 种运算`,
      tag_endless_html: `<b>∞</b> 无尽 0–9`,
      tag_offline_html: `<b>0</b> 联网`,
      strip_q1: `第 1 题 · 记住 7`,
      strip_q2: `第 2 题 · 记住 4`,
      strip_a1_html: `回答第 1 题 <b>7</b>`,
      setup_title: `设置这一局`,
      round_25: `25 题 / 局`,
      round_endless: `∞ 无尽`,
      mode_aria: `训练模式`,
      mode_normal: `25 题训练`,
      mode_normal_sub: `有始有终`,
      mode_endless: `无尽 · 0–9`,
      mode_endless_sub: `点数字即答`,
      field_back: `回溯层数`,
      field_digits: `数字范围`,
      field_endless: `无尽规则`,
      field_ops: `运算类型`,
      hint_back_1: `回答上一题的答案`,
      hint_back_2: `回答上上一题的答案`,
      hint_back_n: `回答 {n} 题前的答案`,
      hint_digits: `决定心算的强度`,
      hint_endless: `答案锁定 0–9`,
      hint_ops: `加减，或四则混合`,
      back_short: `回溯`,
      digits_1: `个位数`,
      digits_1_sub: `一位数 + − × ÷，表内乘除`,
      digits_2: `两位数`,
      digits_2_sub: `两位加减 · 两位 ×/÷ 一位`,
      endless_info: `所有结果都在 0–9 之间。答题时直接点数字，立即提交；没有确认，也没有删除。数字范围设置不会影响本关。`,
      ops_addsub: `加减`,
      ops_addsub_sub: `只出现 + 和 −`,
      ops_all: `加减乘除`,
      ops_all_sub: `四则混合，除法保证整除`,
      n_aria: `回溯层数`,
      digits_aria: `数字范围`,
      ops_aria: `运算类型`,
      start_normal: `开始训练`,
      start_endless: `开始无尽`,
      best_none: `当前设置还没有记录`,
      best_normal: `当前设置最佳 {percent}%{speed}`,
      best_speed: ` · {avg}/题`,
      best_endless_none: `还没有无尽纪录`,
      best_endless: `无尽最佳 {score} 分 · {percent}%`,
      best_storage: ` · 记录不会保存`,
      setup_note_normal: `不限时 · 按自己的节奏`,
      setup_note_endless: `不限时 · 一直答到你想停`,
      guide_title: `别答眼前这道题`,
      guide_step1_title: `先算，再记`,
      guide_step1_text: `每题出现时，先算出答案，把它放进脑子里的记忆队列。`,
      guide_step2_title: `回头看 N 题`,
      guide_step2_text: `从第 N+1 题起，输入的是 N 题前那道题的答案。当前题只是新的记忆材料。`,
      guide_step3_title: `连续训练`,
      guide_step3_text: `普通局 25 题；无尽关一直答到你想停。答错不中断，会显示旧题的正确答案。`,
      guide_fineprint: `减法不会出现负数，除法保证整除。两位数模式下，加减为两位 ± 两位，乘除为两位 ×/÷ 一位。无尽关所有答案固定为 0–9。`,
      guide_more: `查看完整玩法`,
      example_back: `2-回溯示例`,
      example_now: `当前是第 3 题`,
      example_q1: `第 1 题 · 记住 7`,
      example_q2: `第 2 题 · 记住 4`,
      example_q3: `第 3 题 · 别答 18`,
      example_answer_label: `你要回答`,
      example_answer_note: `第 1 题的答案`,
      example_aria: `2-回溯示例`,
      footer_code: `所有代码和数据都在这个网页里`,
      footer_offline: `无需联网`,
      footer_records: `记录仅保存在本机浏览器`,
      game_title_sr: `魔鬼计算训练中`,
      game_quit_exit: `退出`,
      game_quit_end: `结束`,
      game_hud_label: `无尽 · 0–9`,
      hud_answered: `已答`,
      hud_score: `得分`,
      game_warm_hint: `答案不会显示，请自己计算`,
      game_streak: `连击`,
      game_time: `用时`,
      game_correction: `正确答案`,
      game_continue: `继续`,
      game_backspace_aria: `删除一位`,
      game_submit_aria: `提交答案`,
      game_digit_aria: `数字 {digit}`,
      result_panel_aria: `本局成绩`,
      result_score_label: `总得分`,
      result_points: `分`,
      result_new_best: `NEW BEST · 新纪录`,
      result_score_note_normal: `答对一题 100 分，满分 2500 分。`,
      result_score_note_endless: `无尽模式 · 答对一题 100 分，不设上限。`,
      result_stat_correct: `答对`,
      result_stat_streak: `最长连击`,
      result_stat_avg: `平均每题`,
      result_stat_time: `总用时`,
      result_pattern: `答题轨迹`,
      result_pattern_aria: `本局答题轨迹`,
      result_play_again: `再来一局`,
      result_play_endless: `再战无尽`,
      result_adjust: `调整设置`,
      result_history: `查看训练记录`,
      result_foot_normal: `同一设置下，正确率相同则平均用时更短者刷新纪录。`,
      result_foot_endless: `无尽模式按总得分计算纪录；同分时正确率更高者优先。`,
      history_title: `训练记录`,
      history_sub: `只保存在当前浏览器`,
      history_sub_count: `共 {count} 次训练 · 按时间倒序`,
      history_sub_count_one: `已保存 {count} 次训练`,
      history_storage: ` · 当前浏览器禁止保存`,
      history_clear: `清空记录`,
      history_clear_confirm: `再点一次确认清空`,
      history_close: `关闭`,
      history_empty_title: `还没有训练记录`,
      history_empty_copy: `完成一局后，成绩会自动保存在这里。`,
      history_meta: `{correct}/{total} 题 · 连击 {streak} · {avg}/题`,
      history_score: `{score} 分`,
      history_cleared: `训练记录已清空`,
      help_title: `怎么玩`,
      help_lead: `一句话：一边计算当前题目，一边填写前 N 题的答案。`,
      help_step1_title: `先记住 N 题`,
      help_step1_text: `开局会有 N 道热身题。每题出现时，先算出答案，记在脑子里，然后点「记住了」。`,
      help_step2_title: `开始回溯`,
      help_step2_text: `从第 N+1 题起，要回答的是 N 题前那道题的答案。当前题只需要继续计算并记住，不要回答它的答案。`,
      help_step3_title: `连续训练`,
      help_step3_text: `普通局 25 题；无尽关一直答到你想停。答错不中断，会显示旧题的正确答案。`,
      help_example_1: `2-回溯 · 第 1 题`,
      help_example_2: `第 2 题`,
      help_example_3: `第 3 题出现时`,
      help_remember: `记住`,
      help_answer: `回答 7`,
      help_note_time_html: `<b>计时：</b>不限时，按自己的节奏。总用时和平均每题时间会记录在成绩里。`,
      help_note_gen_html: `<b>出题：</b>减法保证非负，除法保证整除。两位数模式下，加减为两位 ± 两位，乘除为两位 ×/÷ 一位。`,
      help_note_endless_html: `<b>无尽关：</b>所有答案固定为 0–9。答题时点一下数字就立即提交，没有确认和删除；难度仍由回溯层数和运算类型决定。`,
      help_note_records_html: `<b>记录：</b>只保存在本机浏览器，不上传任何数据。换浏览器或清除站点数据会清空记录。`,
      help_done: `知道了`,
      close_aria: `关闭`,
      quit_kicker_normal: `END ROUND`,
      quit_kicker_endless: `END ENDLESS`,
      quit_title_normal: `结束本局？`,
      quit_title_endless: `结束无尽挑战？`,
      quit_text_no_answers: `还没有作答，结束后会直接回到设置。`,
      quit_text_endless: `已答 {answered} 题，得分 {score}。结束后会生成本次无尽成绩。`,
      quit_text_normal: `已答 {answered} / {total}。退出后本局进度不会保存。`,
      quit_confirm_no: `结束挑战`,
      quit_confirm_endless: `结束并结算`,
      quit_confirm_normal: `退出本局`,
      quit_cancel_endless: `继续挑战`,
      quit_cancel_normal: `继续训练`,
      quit_exited: `本局已退出`,
      countdown_normal: `先记住 {count} 道题，再开始回溯`,
      countdown_normal_one: `先记住 1 道题，再开始回溯`,
      countdown_endless: `先记住 {count} 道题，再开始无尽`,
      countdown_endless_one: `先记住 1 道题，再开始无尽`,
      countdown_go: `开始`,
      nudge_input: `先输入一个答案`,
      start_fail: `开局失败，请刷新页面后重试`,
      no_answers: `还没有作答，回到设置`,
      storage_fail: `浏览器未允许本地存储，记录不会保存`,
      engine_fail: `计算引擎加载失败，请刷新页面。`,
      title_home: `魔鬼计算 · N-Back 心算训练`,
      title_game: `训练中 · 魔鬼计算`,
      title_result: `本局结果 · 魔鬼计算`,
      meta_description: `一个完全离线的 N-back 心算训练小游戏：支持 1–5 回溯、个位/两位数、加减与四则运算，以及 0–9 无尽关。`,
      state_warm: `记忆热身 {current} / {n}`,
      state_answer: `回答 {prompt}`,
      sub_warm: `算出答案，记在心里；稍后会被问到`,
      sub_answer_endless: `轻点 0–9，直接提交旧题的答案`,
      sub_answer_normal: `当前题只用于记忆，请输入旧题的答案`,
      answer_keep: `把答案记在心里`,
      answer_aria_warm: `把这一题的答案记在心里`,
      answer_aria_prompt: `输入 {prompt} 的答案`,
      tap_hint: `点数字，立即提交`,
      memorize_next: `记住了，下一题`,
      memorize_start: `记住了，开始作答`,
      progress_endless: `已答 {answered} 题`,
      progress_normal: `已答 {answered} / {total}`,
      score: `{score} 分`,
      ready: `准备开始`,
      ready_sub: `准备好了吗？`,
      first_question: `第 1 题即将出现`,
      feedback_correct: `✓ 正确 +100`,
      feedback_correct_streak: `✓ 正确 +100 · 连击 {streak}`,
      feedback_wrong: `✗ 不对，正确答案是 {answer}`,
      feedback_endless_wrong: `✗ 答案是 {answer} · {text}`,
      wrong_input: `你输入了 {value}`,
      result_eyebrow_normal: `ROUND COMPLETE · 本局完成`,
      result_eyebrow_endless: `ENDLESS · 无尽结束`,
      result_title_normal_S: `完美，魔鬼也服气。`,
      result_title_normal_A: `稳得很。`,
      result_title_normal_B: `节奏不错，还能更稳。`,
      result_title_normal_C: `有点魔鬼，但追得上。`,
      result_title_normal_D: `先慢下来，把正确率捡回来。`,
      result_title_endless_S: `无尽也拦不住你。`,
      result_title_endless_A: `越战越稳。`,
      result_title_endless_B: `节奏不错，继续加码。`,
      result_title_endless_C: `还能再稳一点。`,
      result_title_endless_D: `先找回节奏。`,
      result_title_endless_streak: `连击怪物。`,
      pattern_legend_long: `最近 {count} 题 · 绿=答对 · 红=答错`,
      pattern_legend_short: `绿=答对 · 红=答错`,
      pattern_aria_normal: `本局答题轨迹，共 {total} 题：{labels}`,
      pattern_aria_endless: `无尽答题轨迹，共 {total} 题，显示最近 {shown} 题，答对 {correct} 题`,
      pattern_item_title: `第 {n} 题：{result}`,
      pattern_item_label: `第 {n} 题{result}`,
      pattern_correct: `正确`,
      pattern_wrong: `错误`,
      sug_normal_raise: `正确率 {percent}%，这个难度已经稳住。试试 {next}-回溯？`,
      sug_label_raise: `试试 {next}-回溯`,
      sug_normal_2digit: `5-回溯也稳了，换两位数继续？`,
      sug_label_2digit: `换成两位数`,
      sug_normal_max: `最高配置还能保持正确率，魔鬼本人了。`,
      sug_normal_lower: `先把回溯降到 {next}，正确率比难度更重要。`,
      sug_label_lower: `试试 {next}-回溯`,
      sug_normal_digits_down: `两位数压力有点大，换回个位数找找节奏？`,
      sug_label_digits_down: `换成个位数`,
      sug_normal_ops_down: `先去掉乘除，专注加减，把正确率捡回来。`,
      sug_label_ops_down: `改为加减`,
      sug_normal_perfect: `全对。魔鬼计算，不过如此。`,
      sug_normal_slow: `先把节奏放慢，正确率比速度更重要。`,
      sug_normal_steady: `状态很稳，再来一局保持手感。`,
      sug_normal_default: `保持这个节奏，再来一局。`,
      sug_endless_more: `多答几题，成绩会更有参考价值。`,
      sug_endless_raise: `正确率 {percent}%，试试 {next}-回溯的无尽关？`,
      sug_endless_max: `5-回溯无尽关还能稳住，魔鬼本人了。`,
      sug_endless_lower: `把回溯降到 {next}，先把节奏捡回来。`,
      sug_endless_digits_down: `两位数压力有点大，换回个位数找找节奏？`,
      sug_endless_ops_down: `先用加减无尽关找回节奏。`,
      sug_endless_slow: `先把节奏放慢，正确率比速度更重要。`,
      sug_endless_default: `再来一局，看看能连对多少。`
    },
    en: {
      brand: `Devil Calculation`,
      nav_log: `Log`,
      nav_help: `Rules`,
      brand_home_aria: `Back to home`,
      theme_dark_aria: `Switch to dark theme`,
      theme_light_aria: `Switch to light theme`,
      lang_switch_en: `Switch to English`,
      lang_switch_zh: `Switch to Chinese`,
      hero_eyebrow: `WORKING MEMORY · MENTAL MATH`,
      hero_title_html: `Remember N&nbsp;back,<br><em>not this one.</em>`,
      hero_lede_html: `Solve the new problem while recalling an old answer. The current expression is a distraction —<br class="desktop-break">what you enter is the answer from N questions ago.`,
      tag_round_html: `<b>25</b> questions / round`,
      tag_back_html: `<b>1–5</b> back`,
      tag_ops_html: `<b>4</b> operations`,
      tag_endless_html: `<b>∞</b> Endless 0–9`,
      tag_offline_html: `<b>0</b> network`,
      strip_q1: `Q1 · remember 7`,
      strip_q2: `Q2 · remember 4`,
      strip_a1_html: `Answer Q1 <b>7</b>`,
      setup_title: `Set up this round`,
      round_25: `25 / round`,
      round_endless: `∞ Endless`,
      mode_aria: `Training mode`,
      mode_normal: `25-question`,
      mode_normal_sub: `Finite round`,
      mode_endless: `Endless · 0–9`,
      mode_endless_sub: `Tap to answer`,
      field_back: `Back level`,
      field_digits: `Number range`,
      field_endless: `Endless rules`,
      field_ops: `Operations`,
      hint_back_1: `Answer 1 back`,
      hint_back_2: `Answer 2 back`,
      hint_back_n: `Answer {n} back`,
      hint_digits: `Sets the mental load`,
      hint_endless: `Answers fixed 0–9`,
      hint_ops: `Add/subtract or all four`,
      back_short: `BACK`,
      digits_1: `1-digit`,
      digits_1_sub: `1-digit + − × ÷, times-table division`,
      digits_2: `2-digit`,
      digits_2_sub: `2-digit + − · 2-digit ×/÷ 1-digit`,
      endless_info: `Every answer is 0–9. Tap a digit to submit instantly — no confirm or delete. The number-range setting doesn't apply.`,
      ops_addsub: `Add & subtract`,
      ops_addsub_sub: `+ and − only`,
      ops_all: `All four`,
      ops_all_sub: `Mixed, division exact`,
      n_aria: `Back level`,
      digits_aria: `Number range`,
      ops_aria: `Operations`,
      start_normal: `Start training`,
      start_endless: `Start endless`,
      best_none: `No record for this setup yet`,
      best_normal: `Best for this setup: {percent}%{speed}`,
      best_speed: ` · {avg}/q`,
      best_endless_none: `No endless record yet`,
      best_endless: `Endless best: {score} pts · {percent}%`,
      best_storage: ` · records won't be saved`,
      setup_note_normal: `Untimed · go at your own pace`,
      setup_note_endless: `Untimed · stop whenever you like`,
      guide_title: `Don't answer the current one`,
      guide_step1_title: `Compute, then hold`,
      guide_step1_text: `Work out each answer and keep it in your mental queue.`,
      guide_step2_title: `Look N back`,
      guide_step2_text: `From question N+1 on, enter the answer from N questions ago. The current question is just new material.`,
      guide_step3_title: `Keep going`,
      guide_step3_text: `25 questions in a normal round; endless runs until you stop. A wrong answer shows the old correction and continues.`,
      guide_fineprint: `Subtraction never goes negative; division is exact. In 2-digit mode, + − use two-digit operands; ×/÷ pair a two-digit number with a one-digit number. Endless answers are always 0–9.`,
      guide_more: `Full rules`,
      example_back: `2-back example`,
      example_now: `Now showing Q3`,
      example_q1: `Q1 · remember 7`,
      example_q2: `Q2 · remember 4`,
      example_q3: `Q3 · don't answer 18`,
      example_answer_label: `You answer`,
      example_answer_note: `answer to Q1`,
      example_aria: `2-back example`,
      footer_code: `All code and data live in this page`,
      footer_offline: `Works offline`,
      footer_records: `Records stay in this browser`,
      game_title_sr: `Devil Calculation training`,
      game_quit_exit: `Exit`,
      game_quit_end: `End`,
      game_hud_label: `Endless · 0–9`,
      hud_answered: `Answered`,
      hud_score: `Score`,
      game_warm_hint: `The answer won't be shown — calculate it yourself`,
      game_streak: `Streak`,
      game_time: `Time`,
      game_correction: `Correct answer`,
      game_continue: `Continue`,
      game_backspace_aria: `Delete one digit`,
      game_submit_aria: `Submit answer`,
      game_digit_aria: `Number {digit}`,
      result_panel_aria: `Round result`,
      result_score_label: `Total score`,
      result_points: `pts`,
      result_new_best: `NEW BEST`,
      result_score_note_normal: `100 points per correct answer · max 2,500.`,
      result_score_note_endless: `Endless · 100 points per correct answer, no cap.`,
      result_stat_correct: `Correct`,
      result_stat_streak: `Best streak`,
      result_stat_avg: `Avg / question`,
      result_stat_time: `Total time`,
      result_pattern: `Answer track`,
      result_pattern_aria: `Answer track for this round`,
      result_play_again: `Play again`,
      result_play_endless: `Run endless again`,
      result_adjust: `Adjust settings`,
      result_history: `View training log`,
      result_foot_normal: `For the same setup, a faster average breaks a tie.`,
      result_foot_endless: `Endless records go by score; a higher accuracy breaks a tie.`,
      history_title: `Training log`,
      history_sub: `Saved only in this browser`,
      history_sub_count: `{count} sessions · newest first`,
      history_sub_count_one: `{count} session saved`,
      history_storage: ` · storage disabled`,
      history_clear: `Clear log`,
      history_clear_confirm: `Click again to clear`,
      history_close: `Close`,
      history_empty_title: `No sessions yet`,
      history_empty_copy: `Finish a round and it will appear here.`,
      history_meta: `{correct}/{total} · streak {streak} · {avg}/q`,
      history_score: `{score} pts`,
      history_cleared: `Training log cleared`,
      help_title: `How to play`,
      help_lead: `In one sentence: solve the current problem while entering the answer from N questions ago.`,
      help_step1_title: `Memorize N questions`,
      help_step1_text: `Each round starts with N warm-up questions. Work out each answer, hold it, then tap "Got it".`,
      help_step2_title: `Start looking back`,
      help_step2_text: `From question N+1, answer the question N steps back. Keep solving the current one — don't enter its answer.`,
      help_step3_title: `Keep training`,
      help_step3_text: `25 questions in a normal round; endless runs until you stop. A wrong answer shows the old correction and continues.`,
      help_example_1: `2-back · Q1`,
      help_example_2: `Q2`,
      help_example_3: `When Q3 appears`,
      help_remember: `remember`,
      help_answer: `answer 7`,
      help_note_time_html: `<b>Timing:</b> Untimed. Total and average time are recorded.`,
      help_note_gen_html: `<b>Questions:</b> Subtraction is non-negative and division is exact. In 2-digit mode, + − use two-digit operands; ×/÷ pair a two-digit number with a one-digit number.`,
      help_note_endless_html: `<b>Endless:</b> Answers are fixed 0–9. Tap a digit to submit — no confirm or delete. Difficulty follows the back level and operation type.`,
      help_note_records_html: `<b>Records:</b> Stored in this browser only. No data is uploaded. Changing browsers or clearing site data clears them.`,
      help_done: `Got it`,
      close_aria: `Close`,
      quit_kicker_normal: `END ROUND`,
      quit_kicker_endless: `END ENDLESS`,
      quit_title_normal: `End this round?`,
      quit_title_endless: `End the endless run?`,
      quit_text_no_answers: `No answers yet — ending will return to setup.`,
      quit_text_endless: `Answered {answered}, score {score}. Ending will save this endless result.`,
      quit_text_normal: `Answered {answered} / {total}. This round won't be saved.`,
      quit_confirm_no: `End run`,
      quit_confirm_endless: `End & see result`,
      quit_confirm_normal: `Exit round`,
      quit_cancel_endless: `Keep going`,
      quit_cancel_normal: `Keep training`,
      quit_exited: `Round exited`,
      countdown_normal: `Memorize {count} questions first, then start`,
      countdown_normal_one: `Memorize 1 question first, then start`,
      countdown_endless: `Memorize {count} questions first, then start endless`,
      countdown_endless_one: `Memorize 1 question first, then start endless`,
      countdown_go: `Go`,
      nudge_input: `Enter an answer first`,
      start_fail: `Couldn't start — refresh and try again`,
      no_answers: `No answers yet — back to setup`,
      storage_fail: `Browser storage unavailable — records won't be saved`,
      engine_fail: `Calculation engine failed to load. Please refresh.`,
      title_home: `Devil Calculation · N-Back Mental Math`,
      title_game: `Training · Devil Calculation`,
      title_result: `Result · Devil Calculation`,
      meta_description: `An offline N-back mental math game with 1–5 back, single or two-digit questions, add/subtract or all four operations, and a 0–9 endless mode.`,
      state_warm: `Memorize {current} / {n}`,
      state_answer: `Answer {prompt}`,
      sub_warm: `Work it out and hold it — you'll be asked later`,
      sub_answer_endless: `Tap 0–9 to submit the old answer`,
      sub_answer_normal: `This question is only for memory — enter the old answer`,
      answer_keep: `Keep the answer in mind`,
      answer_aria_warm: `Keep this answer in mind`,
      answer_aria_prompt: `Enter the answer from {prompt}`,
      tap_hint: `Tap a digit to submit`,
      memorize_next: `Got it, next`,
      memorize_start: `Got it, start`,
      progress_endless: `Answered {answered}`,
      progress_normal: `Answered {answered} / {total}`,
      score: `{score} pts`,
      ready: `Get ready`,
      ready_sub: `Ready?`,
      first_question: `Question 1 is coming up.`,
      feedback_correct: `✓ Correct +100`,
      feedback_correct_streak: `✓ Correct +100 · streak {streak}`,
      feedback_wrong: `✗ Wrong — the answer is {answer}`,
      feedback_endless_wrong: `✗ Answer {answer} · {text}`,
      wrong_input: `You entered {value}`,
      result_eyebrow_normal: `ROUND COMPLETE`,
      result_eyebrow_endless: `ENDLESS · COMPLETE`,
      result_title_normal_S: `Perfect. Even the devil bows.`,
      result_title_normal_A: `Rock solid.`,
      result_title_normal_B: `Good rhythm — make it steadier.`,
      result_title_normal_C: `Tricky — but you can catch up.`,
      result_title_normal_D: `Slow down and rebuild accuracy.`,
      result_title_endless_S: `Endless couldn't stop you.`,
      result_title_endless_A: `Steady the longer you go.`,
      result_title_endless_B: `Nice pace — keep pushing.`,
      result_title_endless_C: `A little more consistency.`,
      result_title_endless_D: `Find your rhythm again.`,
      result_title_endless_streak: `Streak monster.`,
      pattern_legend_long: `Last {count} · green = correct · red = wrong`,
      pattern_legend_short: `green = correct · red = wrong`,
      pattern_aria_normal: `Round answer track, {total} questions: {labels}`,
      pattern_aria_endless: `Endless answer track · {total} answered · last {shown} shown · {correct} correct`,
      pattern_item_title: `Q{n}: {result}`,
      pattern_item_label: `Q{n} {result}`,
      pattern_correct: `correct`,
      pattern_wrong: `wrong`,
      sug_normal_raise: `You're at {percent}% — this level is solid. Try {next} back?`,
      sug_label_raise: `Try {next} back`,
      sug_normal_2digit: `5-back is solid. Try 2-digit?`,
      sug_label_2digit: `Use 2-digit`,
      sug_normal_max: `Max settings and still accurate. Devil-tier.`,
      sug_normal_lower: `Drop to {next} back — accuracy beats difficulty.`,
      sug_label_lower: `Try {next} back`,
      sug_normal_digits_down: `2-digit is heavy — go back to 1-digit for rhythm?`,
      sug_label_digits_down: `Use 1-digit`,
      sug_normal_ops_down: `Drop ×/÷ and focus on + − to rebuild accuracy.`,
      sug_label_ops_down: `Use + −`,
      sug_normal_perfect: `All correct. So much for the devil.`,
      sug_normal_slow: `Slow down — accuracy beats speed.`,
      sug_normal_steady: `Steady. One more round to keep the feel.`,
      sug_normal_default: `Keep this rhythm. One more round.`,
      sug_endless_more: `A few more questions will make the score meaningful.`,
      sug_endless_raise: `You're at {percent}% — try endless at {next} back?`,
      sug_endless_max: `5-back endless, still solid. Devil-tier.`,
      sug_endless_lower: `Drop to {next} back and rebuild your rhythm.`,
      sug_endless_digits_down: `2-digit is heavy — go back to 1-digit for rhythm?`,
      sug_endless_ops_down: `Try endless with + − first.`,
      sug_endless_slow: `Slow down — accuracy beats speed.`,
      sug_endless_default: `One more run — see how long your streak goes.`
    }
  };

  function t(key, vars) {
    const table = I18N[app.language] || I18N.zh;
    let text = table[key];
    if (text === undefined) text = I18N.zh[key];
    if (text === undefined) return key;
    if (vars) {
      text = text.replace(/\{(\w+)\}/g, (match, name) => (
        Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match
      ));
    }
    return text;
  }

  function formatNumber(value) {
    const number = Number(value) || 0;
    return app.language === 'en' ? number.toLocaleString('en-US') : String(number);
  }

  let storageOK = true;

  function readStore() {
    let raw = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      storageOK = false;
      return E.sanitizeStore(null);
    }
    if (!raw) return E.sanitizeStore(null);
    try {
      return E.sanitizeStore(JSON.parse(raw));
    } catch (error) {
      return E.sanitizeStore(null);
    }
  }

  function detectTheme() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } catch (error) {
      return 'light';
    }
  }

  const initial = readStore();
  const app = {
    settings: initial.settings,
    theme: initial.theme || detectTheme(),
    language: initial.language === 'en' ? 'en' : 'zh',
    setupMode: initial.setupMode,
    sessions: initial.sessions,
    storageOK,
    game: null,
    screen: 'home',
    starting: false,
    lastResult: null,
    lastMode: 'normal',
    suggestionConfig: null,
    suggestionMode: 'normal',
    clearArmed: false,
    clearTimer: null,
    toastTimer: null,
    nudgeTimer: null,
    countdownToken: 0
  };
  app.storageOK = storageOK;

  function persist() {
    if (!app.storageOK) return false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: 1,
        settings: app.settings,
        theme: app.theme,
        language: app.language,
        setupMode: app.setupMode,
        sessions: app.sessions
      }));
      return true;
    } catch (error) {
      markStorageFailed();
      return false;
    }
  }

  function markStorageFailed() {
    if (!app.storageOK) return;
    app.storageOK = false;
    updateBestNote();
    toast(t('storage_fail'));
  }

  function updateLanguageButton() {
    const button = $('lang-btn');
    if (!button) return;
    const label = t(app.language === 'zh' ? 'lang_switch_en' : 'lang_switch_zh');
    button.setAttribute('aria-label', label);
    button.title = label;
  }

  function updateThemeButtons() {
    const target = app.theme === 'dark' ? 'light' : 'dark';
    const label = t(target === 'dark' ? 'theme_dark_aria' : 'theme_light_aria');
    document.querySelectorAll('#theme-btn, #game-theme-btn').forEach((button) => {
      button.setAttribute('aria-label', label);
      button.title = label;
    });
  }

  function updateMeta() {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', t('meta_description'));
  }

  function updateDocumentTitle() {
    document.title = t(`title_${app.screen}`);
  }

  function applyLanguage() {
    document.documentElement.lang = app.language === 'en' ? 'en' : 'zh-CN';
    document.documentElement.dataset.lang = app.language;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-html]').forEach((element) => {
      element.innerHTML = t(element.dataset.i18nHtml);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
      element.setAttribute('aria-label', t(element.dataset.i18nAria));
    });
    document.querySelectorAll('#keypad [data-digit]').forEach((button) => {
      button.setAttribute('aria-label', t('game_digit_aria', { digit: button.dataset.digit }));
    });

    updateLanguageButton();
    updateThemeButtons();
    updateMeta();
    updateDocumentTitle();

    if (app.screen === 'home') {
      applySettingsUI();
      applySetupModeUI();
    } else if (app.screen === 'result' && app.lastResult) {
      renderResult(app.lastResult);
    }
  }

  function toggleLanguage() {
    app.language = app.language === 'zh' ? 'en' : 'zh';
    applyLanguage();
    persist();
  }

  function applyTheme() {
    document.documentElement.dataset.theme = app.theme;
    document.documentElement.style.colorScheme = app.theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', app.theme === 'dark' ? '#111827' : '#f3eee4');
    }
    updateThemeButtons();
  }

  function toggleTheme() {
    app.theme = app.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    persist();
  }

  function applySettingsUI() {
    const groups = [
      { id: 'n-group', key: 'n', compare: (value) => Number(value) === app.settings.n },
      { id: 'digits-group', key: 'digits', compare: (value) => Number(value) === app.settings.digits },
      { id: 'ops-group', key: 'ops', compare: (value) => value === app.settings.ops }
    ];

    groups.forEach((group) => {
      const buttons = document.querySelectorAll(`#${group.id} button[data-value]`);
      buttons.forEach((button) => {
        const checked = group.compare(button.dataset.value);
        button.setAttribute('aria-checked', String(checked));
        button.tabIndex = checked ? 0 : -1;
      });
    });

    const hint = app.settings.n === 1
      ? t('hint_back_1')
      : app.settings.n === 2
        ? t('hint_back_2')
        : t('hint_back_n', { n: app.settings.n });
    $('n-hint').textContent = hint;
    updateBestNote();
  }

  function applySetupModeUI() {
    const endless = app.setupMode === 'endless';
    document.querySelectorAll('#mode-group [data-mode]').forEach((button) => {
      const active = button.dataset.mode === app.setupMode;
      button.setAttribute('aria-checked', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    $('digits-field').hidden = endless;
    $('endless-info').hidden = !endless;
    $('round-badge').textContent = t(endless ? 'round_endless' : 'round_25');
    $('start-label').textContent = t(endless ? 'start_endless' : 'start_normal');
    $('setup-note').textContent = t(endless ? 'setup_note_endless' : 'setup_note_normal');
    updateBestNote();
  }

  function updateBestNote() {
    const note = $('best-note');
    if (!note) return;

    if (app.setupMode === 'endless') {
      const best = E.findEndlessBest(app.sessions, {
        n: app.settings.n,
        digits: 1,
        ops: app.settings.ops
      });
      let text = t('best_endless_none');
      if (best) {
        const percent = best.total > 0 ? Math.round((best.correct / best.total) * 100) : 0;
        text = t('best_endless', { score: formatNumber(best.score), percent });
      }
      if (!app.storageOK) text += t('best_storage');
      note.textContent = text;
      return;
    }

    const best = E.findBest(app.sessions, app.settings, 'normal');
    let text = t('best_none');
    if (best) {
      const percent = Math.round((best.correct / best.total) * 100);
      const speed = best.avgMs > 0 ? t('best_speed', { avg: E.formatAverage(best.avgMs) }) : '';
      text = t('best_normal', { percent, speed });
    }
    if (!app.storageOK) text += t('best_storage');
    note.textContent = text;
  }

  function toast(message) {
    const element = $('toast');
    if (!element) return;
    element.textContent = message;
    element.classList.add('show');
    clearTimeout(app.toastTimer);
    app.toastTimer = setTimeout(() => {
      element.classList.remove('show');
    }, 1900);
  }

  function showScreen(name, focus) {
    ['home', 'game', 'result'].forEach((key) => {
      const screen = $(`screen-${key}`);
      if (screen) screen.hidden = key !== name;
    });
    app.screen = name;
    document.body.dataset.screen = name;
    window.scrollTo(0, 0);
    updateDocumentTitle();

    if (focus !== false) {
      const heading = name === 'game'
        ? $('game-title')
        : name === 'result'
          ? $('result-title')
          : $('home-title');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    }
  }

  function buildSegments(session) {
    if (!Number.isFinite(session.total)) {
      $('segments').replaceChildren();
      return;
    }
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < session.total; index += 1) {
      const segment = document.createElement('span');
      segment.className = 'seg';
      fragment.append(segment);
    }
    $('segments').replaceChildren(fragment);
  }

  function prepareGameChrome() {
    const game = app.game;
    if (!game) return;
    const session = game.session;
    const endless = game.mode === 'endless';

    $('screen-game').dataset.mode = game.mode;
    $('game-config').textContent = endless
      ? E.endlessLabel(game.config, true, app.language)
      : E.configLabel(game.config, false, app.language);
    $('progress-block').hidden = endless;
    $('endless-hud').hidden = !endless;
    $('endless-answered').textContent = '0';
    $('endless-score').textContent = '0';
    $('quit-label').textContent = t(endless ? 'game_quit_end' : 'game_quit_exit');
    $('progress-text').textContent = endless
      ? t('progress_endless', { answered: 0 })
      : t('progress_normal', { answered: 0, total: session.total });
    $('score-text').textContent = t('score', { score: 0 });
    $('elapsed').textContent = '00:00';
    $('streak').textContent = '0';
    $('streak-wrap').classList.remove('hot', 'bump');
    $('state-chip').dataset.mode = 'warm';
    $('state-label').textContent = t('ready');
    $('expression').textContent = '· · ·';
    $('expression').setAttribute('aria-label', t('ready'));
    $('expression-sub').textContent = t('ready_sub');
    $('answer-label').textContent = t('first_question');
    $('answer-value').textContent = '?';
    $('answer-box').dataset.empty = 'true';
    $('answer-box').classList.remove('is-correct', 'is-wrong', 'is-locked', 'is-nudge');
    $('feedback-line').textContent = '';
    $('feedback-line').className = 'feedback-line';
    $('feedback-line').hidden = true;
    $('warm-actions').hidden = true;
    $('keypad').hidden = true;
    $('correction').hidden = true;
    $('correction-bar').classList.remove('run');
    $('interaction').classList.remove('is-memory');
    setKeypadDisabled(false);
    clearEndlessButtonStates();
    buildSegments(session);
  }

  function renderExpression(question) {
    const element = $('expression');
    const first = document.createElement('span');
    first.className = 'num';
    first.textContent = String(question.a);
    const operator = document.createElement('span');
    operator.className = 'op';
    operator.textContent = question.symbol;
    const second = document.createElement('span');
    second.className = 'num';
    second.textContent = String(question.b);
    element.replaceChildren(first, operator, second);
    element.setAttribute('aria-label', E.questionLabel(question, app.language));
  }

  function renderQuestion() {
    const game = app.game;
    if (!game) return;
    const session = game.session;
    if (session.phase === 'done') return;
    const question = session.current;
    if (!question) return;

    const warmup = session.phase === 'warmup';
    const endless = game.mode === 'endless';
    renderExpression(question);

    $('state-chip').dataset.mode = warmup ? 'warm' : 'answer';
    const prompt = E.statusText(session.n, app.language);
    if (warmup) {
      $('state-label').textContent = t('state_warm', {
        current: session.warmupDone + 1,
        n: session.n
      });
      $('expression-sub').textContent = t('sub_warm');
    } else {
      $('state-label').textContent = t('state_answer', { prompt });
      $('expression-sub').textContent = endless
        ? t('sub_answer_endless')
        : t('sub_answer_normal');
    }
    $('answer-label').textContent = warmup ? t('answer_keep') : prompt;

    const box = $('answer-box');
    box.classList.remove('is-correct', 'is-wrong', 'is-nudge');
    box.classList.toggle('is-locked', warmup);
    box.dataset.empty = 'true';
    box.setAttribute(
      'aria-label',
      warmup ? t('answer_aria_warm') : t('answer_aria_prompt', { prompt })
    );
    $('answer-value').textContent = '?';

    const line = $('feedback-line');
    line.textContent = warmup || !endless ? '' : t('tap_hint');
    line.className = 'feedback-line';
    line.hidden = warmup;

    $('warm-actions').hidden = !warmup;
    $('keypad').hidden = warmup;
    $('correction').hidden = true;
    $('correction-bar').classList.remove('run');
    $('interaction').classList.toggle('is-memory', warmup);
    setKeypadDisabled(false);
    clearEndlessButtonStates();

    if (warmup) {
      const dots = $('memory-dots');
      dots.replaceChildren();
      for (let index = 0; index < session.n; index += 1) {
        const dot = document.createElement('i');
        if (index < session.warmupDone) dot.className = 'done';
        dots.append(dot);
      }
      const lastWarmup = session.warmupDone >= session.n - 1;
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '→';
      $('memorize-btn').replaceChildren(
        document.createTextNode(`${t(lastWarmup ? 'memorize_start' : 'memorize_next')} `),
        arrow
      );
    }

    renderProgress();
    renderScore(false);
    game.questionAt = game.startedAt ? performance.now() : 0;
    animateExpression();
  }

  function animateExpression() {
    const element = $('expression');
    element.classList.remove('swap');
    void element.offsetWidth;
    element.classList.add('swap');
  }

  function renderProgress() {
    const game = app.game;
    if (!game) return;
    const session = game.session;

    if (game.mode === 'endless') {
      $('endless-answered').textContent = String(session.answered);
      $('endless-score').textContent = formatNumber(session.score);
      $('progress-text').textContent = t('progress_endless', { answered: session.answered });
      $('score-text').textContent = t('score', { score: formatNumber(session.score) });
      return;
    }

    const segments = $('segments').children;
    for (let index = 0; index < session.total; index += 1) {
      const segment = segments[index];
      if (!segment) continue;
      let className = 'seg';
      if (index < session.results.length) {
        className += session.results[index].correct ? ' done' : ' wrong';
      } else if (session.phase === 'answer' && index === session.results.length) {
        className += ' current';
      }
      segment.className = className;
    }
    $('progress-text').textContent = t('progress_normal', {
      answered: session.answered,
      total: session.total
    });
    $('score-text').textContent = t('score', { score: formatNumber(session.score) });
  }

  function renderScore(bump) {
    const game = app.game;
    if (!game) return;
    const session = game.session;
    const streakWrap = $('streak-wrap');
    $('streak').textContent = String(session.streak);
    streakWrap.classList.toggle('hot', session.streak > 0);

    if (game.mode === 'endless') {
      $('endless-score').textContent = formatNumber(session.score);
      if (bump) {
        const endlessScore = $('endless-score');
        endlessScore.classList.remove('bump');
        void endlessScore.offsetWidth;
        endlessScore.classList.add('bump');
      }
    }

    if (bump) {
      const score = $('score-text');
      score.classList.remove('bump');
      void score.offsetWidth;
      score.classList.add('bump');
      streakWrap.classList.remove('bump');
      void streakWrap.offsetWidth;
      streakWrap.classList.add('bump');
    }
  }

  function renderInput() {
    const game = app.game;
    if (!game) return;
    const value = game.input;
    $('answer-value').textContent = value || '?';
    $('answer-box').dataset.empty = value ? 'false' : 'true';
  }

  function setKeypadDisabled(disabled) {
    const keypad = $('keypad');
    keypad.classList.toggle('is-disabled', disabled);
    keypad.querySelectorAll('button').forEach((button) => {
      button.disabled = disabled;
    });
  }

  function clearEndlessButtonStates() {
    $('keypad').querySelectorAll('[data-digit]').forEach((button) => {
      button.classList.remove('is-correct', 'is-wrong', 'is-answer');
    });
  }

  function shakeAnswer(message) {
    const line = $('feedback-line');
    if (message) {
      line.textContent = message;
      line.className = 'feedback-line nudge';
    }
    const box = $('answer-box');
    box.classList.remove('is-nudge');
    void box.offsetWidth;
    box.classList.add('is-nudge');
    clearTimeout(app.nudgeTimer);
    app.nudgeTimer = setTimeout(() => {
      box.classList.remove('is-nudge');
    }, 440);
  }

  function pressDigit(digit) {
    const game = app.game;
    if (!game || !game.startedAt || game.session.phase !== 'answer' || game.submitting) return;
    if (game.mode === 'endless') {
      submitEndlessDigit(digit);
      return;
    }
    if (game.mode !== 'normal') return;
    const maxDigits = E.maxInputDigits(game.config);
    if (game.input === '0') game.input = '';
    if (game.input.length >= maxDigits) {
      shakeAnswer('');
      return;
    }
    game.input += digit;
    const line = $('feedback-line');
    if (line.classList.contains('nudge')) {
      line.textContent = '';
      line.className = 'feedback-line';
    }
    renderInput();
  }

  function backspace() {
    const game = app.game;
    if (!game || game.mode !== 'normal' || !game.startedAt || game.session.phase !== 'answer' || game.submitting) return;
    if (!game.input) return;
    game.input = game.input.slice(0, -1);
    renderInput();
  }

  function submitAnswer() {
    const game = app.game;
    if (!game || game.mode !== 'normal' || !game.startedAt || game.session.phase !== 'answer' || game.submitting) return;
    if (!game.input) {
      shakeAnswer(t('nudge_input'));
      return;
    }

    game.submitting = true;
    const value = Number(game.input);
    const responseMs = game.questionAt ? performance.now() - game.questionAt : 0;
    const result = game.session.submit(value, responseMs);
    game.input = '';
    if (game.session.answered >= game.session.total) {
      game.endedAt = performance.now();
    }

    renderProgress();
    renderScore(result.correct);

    const box = $('answer-box');
    box.classList.remove('is-locked', 'is-nudge', 'is-correct', 'is-wrong');
    box.classList.add(result.correct ? 'is-correct' : 'is-wrong');
    box.dataset.empty = 'false';
    $('answer-value').textContent = String(value);

    const line = $('feedback-line');
    if (result.correct) {
      line.textContent = game.session.streak >= 3
        ? t('feedback_correct_streak', { streak: game.session.streak })
        : t('feedback_correct');
      line.className = 'feedback-line correct';
      setKeypadDisabled(true);
      game.correctTimer = setTimeout(() => {
        if (!app.game || app.game !== game) return;
        setKeypadDisabled(false);
        advanceAfterFeedback();
      }, 640);
    } else {
      line.textContent = t('feedback_wrong', { answer: result.targetAnswer });
      line.className = 'feedback-line wrong';
      showCorrection(result);
    }
    game.submitting = false;
  }

  function submitEndlessDigit(rawDigit) {
    const game = app.game;
    if (!game || game.mode !== 'endless' || !game.startedAt || game.session.phase !== 'answer' || game.submitting) return;
    const digit = Number(rawDigit);
    if (!Number.isInteger(digit) || digit < 0 || digit > 9) return;

    game.submitting = true;
    const responseMs = game.questionAt ? performance.now() - game.questionAt : 0;
    const result = game.session.submit(digit, responseMs);
    game.submitting = false;

    renderProgress();
    renderScore(result.correct);

    const keypad = $('keypad');
    clearEndlessButtonStates();
    const tapped = keypad.querySelector(`[data-digit="${digit}"]`);
    if (tapped) tapped.classList.add(result.correct ? 'is-correct' : 'is-wrong');
    if (!result.correct) {
      const correctButton = keypad.querySelector(`[data-digit="${result.targetAnswer}"]`);
      if (correctButton) correctButton.classList.add('is-answer');
    }

    const line = $('feedback-line');
    if (result.correct) {
      line.textContent = game.session.streak >= 3
        ? t('feedback_correct_streak', { streak: game.session.streak })
        : t('feedback_correct');
      line.className = 'feedback-line correct';
    } else {
      line.textContent = t('feedback_endless_wrong', {
        answer: result.targetAnswer,
        text: result.targetText
      });
      line.className = 'feedback-line wrong';
    }

    setKeypadDisabled(true);
    clearTimeout(game.endlessTimer);
    game.endlessTimer = setTimeout(() => {
      if (app.game !== game) return;
      advanceAfterFeedback();
    }, result.correct ? 300 : 1050);
  }

  function showCorrection(result) {
    const game = app.game;
    if (!game) return;
    game.correctionOpen = true;
    $('keypad').hidden = true;
    $('correction').hidden = false;
    $('correct-answer').textContent = String(result.targetAnswer);
    $('wrong-input').textContent = t('wrong_input', { value: result.value });
    $('correct-question').textContent = `${result.targetText} = ${result.targetAnswer}`;

    const bar = $('correction-bar');
    bar.classList.remove('run');
    void bar.offsetWidth;
    bar.classList.add('run');

    clearTimeout(game.wrongTimer);
    game.wrongTimer = setTimeout(() => {
      if (app.game === game) continueAfterWrong();
    }, 3200);
  }

  function continueAfterWrong() {
    const game = app.game;
    if (!game || !game.correctionOpen) return;
    game.correctionOpen = false;
    clearTimeout(game.wrongTimer);
    $('correction').hidden = true;
    $('correction-bar').classList.remove('run');
    advanceAfterFeedback();
  }

  function advanceAfterFeedback() {
    const game = app.game;
    if (!game || game.session.phase !== 'feedback') return;
    const phase = game.session.advance();
    if (phase === 'done') {
      if (game.mode === 'endless') finishEndless();
      else finishRound();
      return;
    }
    renderQuestion();
  }

  function memorizeCurrent() {
    const game = app.game;
    if (!game || !game.startedAt || game.session.phase !== 'warmup') return;
    game.session.memorize();
    renderQuestion();
  }

  function startClock(game) {
    if (game.clockId) clearInterval(game.clockId);
    const update = () => {
      if (app.game !== game) return;
      $('elapsed').textContent = E.formatDuration(performance.now() - game.startedAt);
    };
    update();
    game.clockId = setInterval(update, 500);
  }

  function clearGameTimers(game) {
    if (!game) return;
    if (game.clockId) {
      clearInterval(game.clockId);
      game.clockId = null;
    }
    if (game.correctTimer) {
      clearTimeout(game.correctTimer);
      game.correctTimer = null;
    }
    if (game.wrongTimer) {
      clearTimeout(game.wrongTimer);
      game.wrongTimer = null;
    }
    if (game.endlessTimer) {
      clearTimeout(game.endlessTimer);
      game.endlessTimer = null;
    }
  }

  function startRound(rawConfig, mode) {
    if (app.starting) return Promise.resolve();
    app.starting = true;
    closeDialogs();

    try {
      if (app.game) clearGameTimers(app.game);
      const gameMode = mode === 'endless' ? 'endless' : 'normal';
      let config;

      if (gameMode === 'endless') {
        const base = E.normalizeConfig(rawConfig || app.settings);
        config = { n: base.n, digits: 1, ops: base.ops };
        app.settings = E.normalizeConfig({ ...app.settings, n: base.n, ops: base.ops });
        app.setupMode = 'endless';
        applySettingsUI();
        applySetupModeUI();
        persist();
      } else {
        config = E.normalizeConfig(rawConfig || app.settings);
        app.settings = config;
        app.setupMode = 'normal';
        applySettingsUI();
        applySetupModeUI();
        persist();
      }

      const session = new E.GameSession(
        config,
        gameMode === 'endless' ? Number.POSITIVE_INFINITY : E.TOTAL_QUESTIONS,
        undefined,
        { endless: gameMode === 'endless' }
      );
      const game = {
        mode: gameMode,
        session,
        config,
        input: '',
        startedAt: 0,
        questionAt: 0,
        endedAt: 0,
        clockId: null,
        correctTimer: null,
        wrongTimer: null,
        endlessTimer: null,
        correctionOpen: false,
        submitting: false
      };
      app.game = game;
      const token = ++app.countdownToken;

      showScreen('game');
      prepareGameChrome();

      return runCountdown(token).then(() => {
        if (token !== app.countdownToken || app.game !== game) {
          app.starting = false;
          return;
        }
        const now = performance.now();
        game.startedAt = now;
        game.questionAt = now;
        startClock(game);
        renderQuestion();
        app.starting = false;
      });
    } catch (error) {
      console.error(error);
      app.starting = false;
      app.game = null;
      showScreen('home');
      toast(t('start_fail'));
      return Promise.resolve();
    }
  }

  function runCountdown(token) {
    return new Promise((resolve) => {
      const overlay = $('countdown');
      const number = $('count-num');
      const message = $('count-msg');
      const count = app.game ? app.game.config.n : app.settings.n;
      const endless = app.game && app.game.mode === 'endless';

      message.textContent = endless
        ? t(count === 1 ? 'countdown_endless_one' : 'countdown_endless', { count })
        : t(count === 1 ? 'countdown_normal_one' : 'countdown_normal', { count });
      overlay.hidden = false;
      overlay.classList.remove('out');

      let step = 0;
      const tick = () => {
        if (token !== app.countdownToken) {
          resolve();
          return;
        }
        if (step < 3) {
          number.textContent = ['3', '2', '1'][step];
          number.classList.remove('tick');
          void number.offsetWidth;
          number.classList.add('tick');
          step += 1;
          setTimeout(tick, 620);
          return;
        }

        number.textContent = t('countdown_go');
        number.classList.remove('tick');
        void number.offsetWidth;
        number.classList.add('tick');
        setTimeout(() => {
          if (token !== app.countdownToken) {
            resolve();
            return;
          }
          overlay.classList.add('out');
          setTimeout(() => {
            if (token !== app.countdownToken) {
              resolve();
              return;
            }
            overlay.hidden = true;
            overlay.classList.remove('out');
            resolve();
          }, 260);
        }, 440);
      };

      tick();
    });
  }

  function finishRound() {
    const game = app.game;
    if (!game) return;
    const session = game.session;
    clearGameTimers(game);

    const endedAt = game.endedAt || performance.now();
    const durationMs = Math.max(0, endedAt - game.startedAt);
    const totalResponseMs = session.results.reduce((sum, result) => sum + result.responseMs, 0);
    const avgMs = session.results.length
      ? Math.round(totalResponseMs / session.results.length)
      : 0;
    const record = {
      ts: Date.now(),
      mode: 'normal',
      n: session.n,
      digits: session.digits,
      ops: session.ops,
      correct: session.correct,
      total: session.total,
      score: session.score,
      bestStreak: session.bestStreak,
      avgMs,
      durationMs
    };

    const bestBefore = E.findBest(app.sessions, record, 'normal');
    const bestAvg = bestBefore && bestBefore.avgMs > 0 ? bestBefore.avgMs : Infinity;
    const isRecord = !bestBefore
      || record.correct > bestBefore.correct
      || (record.correct === bestBefore.correct && record.avgMs < bestAvg);

    app.sessions.push(record);
    if (app.sessions.length > E.MAX_SESSIONS) {
      app.sessions = app.sessions.slice(-E.MAX_SESSIONS);
    }
    persist();

    const data = {
      record,
      isRecord,
      results: session.results.slice(),
      rank: E.rankFor(record.correct, record.total),
      mode: 'normal'
    };
    app.lastResult = data;
    app.lastMode = 'normal';
    app.game = null;

    renderResult(data);
    showScreen('result');
    updateBestNote();
  }

  function finishEndless() {
    const game = app.game;
    if (!game || game.mode !== 'endless') return;
    const session = game.session;
    clearGameTimers(game);

    if (session.answered === 0) {
      session.end();
      app.game = null;
      showScreen('home');
      updateBestNote();
      toast(t('no_answers'));
      return;
    }

    const endedAt = game.endedAt || performance.now();
    const durationMs = Math.max(0, endedAt - game.startedAt);
    const totalResponseMs = session.results.reduce((sum, result) => sum + result.responseMs, 0);
    const avgMs = session.results.length
      ? Math.round(totalResponseMs / session.results.length)
      : 0;
    const answered = session.answered;
    const record = {
      ts: Date.now(),
      mode: 'endless',
      n: session.n,
      digits: 1,
      ops: session.ops,
      correct: session.correct,
      total: answered,
      score: session.score,
      bestStreak: session.bestStreak,
      avgMs,
      durationMs
    };
    session.end();

    const bestBefore = E.findEndlessBest(app.sessions, {
      n: session.n,
      digits: 1,
      ops: session.ops
    });
    const accuracy = answered > 0 ? session.correct / answered : 0;
    const bestAccuracy = bestBefore && bestBefore.total > 0
      ? bestBefore.correct / bestBefore.total
      : 0;
    const bestSpeed = bestBefore && bestBefore.avgMs > 0 ? bestBefore.avgMs : Infinity;
    const isRecord = !bestBefore
      || record.score > bestBefore.score
      || (record.score === bestBefore.score && accuracy > bestAccuracy)
      || (record.score === bestBefore.score && accuracy === bestAccuracy && record.avgMs < bestSpeed);

    app.sessions.push(record);
    if (app.sessions.length > E.MAX_SESSIONS) {
      app.sessions = app.sessions.slice(-E.MAX_SESSIONS);
    }
    persist();

    const data = {
      record,
      isRecord,
      results: session.results.slice(),
      rank: E.rankFor(record.correct, record.total),
      mode: 'endless'
    };
    app.lastResult = data;
    app.lastMode = 'endless';
    app.game = null;

    renderResult(data);
    showScreen('result');
    updateBestNote();
  }

  function resultTitle(rank) {
    const key = `result_title_normal_${rank}`;
    return t(I18N[app.language] && I18N[app.language][key] ? key : 'result_title_normal_B');
  }

  function endlessResultTitle(rank, record) {
    if (record.bestStreak >= 20) return t('result_title_endless_streak');
    const key = `result_title_endless_${rank}`;
    return t(I18N[app.language] && I18N[app.language][key] ? key : 'result_title_endless_C');
  }

  function buildSuggestion(record, percent) {
    const { n, digits, ops } = record;
    if (percent >= 90 && n < 5) {
      return {
        text: t('sug_normal_raise', { percent, next: n + 1 }),
        label: t('sug_label_raise', { next: n + 1 }),
        config: { n: n + 1, digits, ops }
      };
    }
    if (percent >= 90 && n === 5 && digits === 1) {
      return {
        text: t('sug_normal_2digit'),
        label: t('sug_label_2digit'),
        config: { n, digits: 2, ops }
      };
    }
    if (percent >= 90 && n === 5 && digits === 2) {
      return {
        text: t('sug_normal_max'),
        label: '',
        config: null
      };
    }
    if (percent < 60 && n > 1) {
      return {
        text: t('sug_normal_lower', { next: n - 1 }),
        label: t('sug_label_lower', { next: n - 1 }),
        config: { n: n - 1, digits, ops }
      };
    }
    if (percent < 60 && digits === 2) {
      return {
        text: t('sug_normal_digits_down'),
        label: t('sug_label_digits_down'),
        config: { n, digits: 1, ops }
      };
    }
    if (percent < 60 && ops === 'all') {
      return {
        text: t('sug_normal_ops_down'),
        label: t('sug_label_ops_down'),
        config: { n, digits, ops: 'addsub' }
      };
    }
    if (percent === 100) {
      return {
        text: t('sug_normal_perfect'),
        label: '',
        config: null
      };
    }
    if (percent < 60) {
      return {
        text: t('sug_normal_slow'),
        label: '',
        config: null
      };
    }
    if (percent >= 90) {
      return {
        text: t('sug_normal_steady'),
        label: '',
        config: null
      };
    }
    return {
      text: t('sug_normal_default'),
      label: '',
      config: null
    };
  }

  function buildEndlessSuggestion(record, percent) {
    const { n, ops, total } = record;
    if (total < 8) {
      return {
        text: t('sug_endless_more'),
        label: '',
        config: null
      };
    }
    if (percent >= 90 && n < 5) {
      return {
        text: t('sug_endless_raise', { percent, next: n + 1 }),
        label: t('sug_label_raise', { next: n + 1 }),
        config: { n: n + 1, digits: 1, ops }
      };
    }
    if (percent >= 90 && n === 5) {
      return {
        text: t('sug_endless_max'),
        label: '',
        config: null
      };
    }
    if (percent < 60 && n > 1) {
      return {
        text: t('sug_endless_lower', { next: n - 1 }),
        label: t('sug_label_lower', { next: n - 1 }),
        config: { n: n - 1, digits: 1, ops }
      };
    }
    if (percent < 60 && ops === 'all') {
      return {
        text: t('sug_endless_ops_down'),
        label: t('sug_label_ops_down'),
        config: { n, digits: 1, ops: 'addsub' }
      };
    }
    if (percent < 60) {
      return {
        text: t('sug_endless_slow'),
        label: '',
        config: null
      };
    }
    return {
      text: t('sug_endless_default'),
      label: '',
      config: null
    };
  }

  function backTag(n) {
    return app.language === 'en' ? `${n}-back` : `${n}-回溯`;
  }

  function digitsTag(digits) {
    return t(digits === 2 ? 'digits_2' : 'digits_1');
  }

  function opsTag(ops) {
    return t(ops === 'all' ? 'ops_all' : 'ops_addsub');
  }

  function renderResult(data) {
    const { record, isRecord, results, rank } = data;
    const endless = data.mode === 'endless';
    const percent = record.total > 0
      ? Math.round((record.correct / record.total) * 100)
      : 0;

    app.lastMode = endless ? 'endless' : 'normal';
    app.suggestionMode = app.lastMode;

    $('result-eyebrow-text').textContent = t(endless ? 'result_eyebrow_endless' : 'result_eyebrow_normal');
    $('result-title').textContent = endless
      ? endlessResultTitle(rank, record)
      : resultTitle(rank);

    const config = $('result-config');
    config.replaceChildren();
    const chips = endless
      ? [t('game_hud_label'), backTag(record.n), opsTag(record.ops)]
      : [backTag(record.n), digitsTag(record.digits), opsTag(record.ops)];
    chips.forEach((text) => {
      const chip = document.createElement('span');
      chip.textContent = text;
      config.append(chip);
    });

    const medal = $('medal');
    medal.dataset.rank = rank;
    medal.style.setProperty('--acc', `${percent}%`);
    $('rank-letter').textContent = rank;
    $('accuracy-value').textContent = `${percent}%`;
    $('score-value').textContent = formatNumber(record.score);
    $('new-best').hidden = !isRecord;
    $('score-note').textContent = t(endless ? 'result_score_note_endless' : 'result_score_note_normal');
    $('stat-correct').textContent = `${record.correct} / ${record.total}`;
    $('stat-streak').textContent = String(record.bestStreak);
    $('stat-avg').textContent = E.formatAverage(record.avgMs);
    $('stat-time').textContent = E.formatDuration(record.durationMs);
    $('play-again-label').textContent = t(endless ? 'result_play_endless' : 'result_play_again');
    $('result-foot').textContent = t(endless ? 'result_foot_endless' : 'result_foot_normal');

    const pattern = $('result-pattern');
    pattern.replaceChildren();
    const patternResults = endless ? results.slice(-60) : results;
    const patternOffset = results.length - patternResults.length;
    const labels = [];
    patternResults.forEach((result, index) => {
      const questionNumber = patternOffset + index + 1;
      const item = document.createElement('i');
      item.className = result.correct ? 'ok' : 'bad';
      const verdict = t(result.correct ? 'pattern_correct' : 'pattern_wrong');
      item.title = t('pattern_item_title', { n: questionNumber, result: verdict });
      pattern.append(item);
      if (!endless) {
        labels.push(t('pattern_item_label', { n: questionNumber, result: verdict }));
      }
    });
    $('pattern-legend').textContent = endless && results.length > 60
      ? t('pattern_legend_long', { count: patternResults.length })
      : t('pattern_legend_short');
    pattern.setAttribute(
      'aria-label',
      endless
        ? t('pattern_aria_endless', {
          total: results.length,
          shown: patternResults.length,
          correct: record.correct
        })
        : t('pattern_aria_normal', {
          total: results.length,
          labels: labels.join(app.language === 'en' ? ', ' : '，')
        })
    );

    const suggestion = endless
      ? buildEndlessSuggestion(record, percent)
      : buildSuggestion(record, percent);
    $('suggestion-text').textContent = suggestion.text;
    const action = $('suggestion-action');
    if (suggestion.config) {
      app.suggestionConfig = suggestion.config;
      action.hidden = false;
      action.textContent = `${suggestion.label} →`;
    } else {
      app.suggestionConfig = null;
      action.hidden = true;
    }
  }

  function openHistory() {
    resetClearButton();
    renderHistory();
    const dialog = $('history-dialog');
    if (!dialog.open) dialog.showModal();
  }

  function renderHistory() {
    const list = $('history-list');
    list.replaceChildren();
    const sessions = app.sessions.slice().sort((a, b) => b.ts - a.ts);

    $('history-sub').textContent = sessions.length
      ? t(sessions.length === 1 ? 'history_sub_count_one' : 'history_sub_count', { count: sessions.length })
      : t('history_sub');
    if (!app.storageOK) {
      $('history-sub').textContent += t('history_storage');
    }
    $('clear-history').disabled = sessions.length === 0;

    if (!sessions.length) {
      const empty = document.createElement('div');
      empty.className = 'history-empty';
      const mark = document.createElement('div');
      mark.className = 'empty-mark';
      mark.textContent = '∅';
      const title = document.createElement('b');
      title.textContent = t('history_empty_title');
      const copy = document.createElement('p');
      copy.textContent = t('history_empty_copy');
      empty.append(mark, title, copy);
      list.append(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    sessions.slice(0, 30).forEach((session) => {
      const date = new Date(session.ts);
      const endless = session.mode === 'endless';
      const row = document.createElement('div');
      row.className = 'record';

      const dateBlock = document.createElement('div');
      dateBlock.className = 'record-date';
      const dateLine = document.createElement('b');
      dateLine.textContent = `${pad2(date.getMonth() + 1)}.${pad2(date.getDate())}`;
      const timeLine = document.createElement('span');
      timeLine.textContent = `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
      dateBlock.append(dateLine, timeLine);

      const main = document.createElement('div');
      main.className = 'record-main';
      const config = document.createElement('div');
      config.className = 'record-config';
      config.textContent = endless
        ? E.endlessLabel(session, true, app.language)
        : E.configLabel(session, true, app.language);
      const meta = document.createElement('div');
      meta.className = 'record-meta';
      meta.textContent = t('history_meta', {
        correct: session.correct,
        total: session.total,
        streak: session.bestStreak,
        avg: E.formatAverage(session.avgMs)
      });
      main.append(config, meta);

      const result = document.createElement('div');
      result.className = 'record-result';
      const percent = session.total > 0
        ? Math.round((session.correct / session.total) * 100)
        : 0;
      const accuracy = document.createElement('b');
      accuracy.textContent = `${percent}%`;
      if (percent < 60) accuracy.classList.add('low');
      const score = document.createElement('span');
      score.textContent = t('history_score', { score: formatNumber(session.score) });
      result.append(accuracy, score);

      row.append(dateBlock, main, result);
      fragment.append(row);
    });
    list.append(fragment);
  }

  function resetClearButton() {
    clearTimeout(app.clearTimer);
    app.clearArmed = false;
    const button = $('clear-history');
    if (!button) return;
    button.textContent = t('history_clear');
    button.classList.remove('armed');
  }

  function handleClearHistory() {
    if (!app.sessions.length) return;
    const button = $('clear-history');
    if (!app.clearArmed) {
      app.clearArmed = true;
      button.textContent = t('history_clear_confirm');
      button.classList.add('armed');
      clearTimeout(app.clearTimer);
      app.clearTimer = setTimeout(resetClearButton, 3200);
      return;
    }

    resetClearButton();
    app.sessions = [];
    persist();
    renderHistory();
    updateBestNote();
    toast(t('history_cleared'));
  }

  function openHelp() {
    const dialog = $('help-dialog');
    if (!dialog.open) dialog.showModal();
  }

  function openQuit() {
    if (!app.game) return;
    const game = app.game;
    const session = game.session;
    const endless = game.mode === 'endless';
    const noAnswers = endless && session.answered === 0;

    $('quit-kicker').textContent = t(endless ? 'quit_kicker_endless' : 'quit_kicker_normal');
    $('quit-title').textContent = t(endless ? 'quit_title_endless' : 'quit_title_normal');
    $('quit-text').textContent = noAnswers
      ? t('quit_text_no_answers')
      : endless
        ? t('quit_text_endless', {
          answered: session.answered,
          score: formatNumber(session.score)
        })
        : t('quit_text_normal', {
          answered: session.answered,
          total: session.total
        });
    $('quit-confirm').textContent = noAnswers
      ? t('quit_confirm_no')
      : t(endless ? 'quit_confirm_endless' : 'quit_confirm_normal');
    $('quit-cancel').textContent = t(endless ? 'quit_cancel_endless' : 'quit_cancel_normal');

    const dialog = $('quit-dialog');
    if (!dialog.open) dialog.showModal();
  }

  function quitCurrentGame() {
    app.countdownToken += 1;
    const overlay = $('countdown');
    overlay.hidden = true;
    overlay.classList.remove('out');
    clearGameTimers(app.game);
    app.game = null;
    app.starting = false;
    const dialog = $('quit-dialog');
    if (dialog.open) dialog.close();
    showScreen('home');
    toast(t('quit_exited'));
  }

  function closeDialogs() {
    document.querySelectorAll('dialog[open]').forEach((dialog) => {
      dialog.close();
    });
  }

  function bindEvents() {
    document.querySelectorAll('[data-setting]').forEach((group) => {
      group.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-value]');
        if (!button) return;
        const key = group.dataset.setting;
        const value = key === 'ops' ? button.dataset.value : Number(button.dataset.value);
        app.settings = E.normalizeConfig({ ...app.settings, [key]: value });
        applySettingsUI();
        persist();
      });

      group.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        const buttons = Array.from(group.querySelectorAll('button[data-value]'));
        const current = buttons.indexOf(document.activeElement);
        if (current < 0) return;
        event.preventDefault();
        const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
        const next = buttons[(current + direction + buttons.length) % buttons.length];
        next.focus();
        next.click();
      });
    });

    $('start-btn').addEventListener('click', () => {
      if (app.setupMode === 'endless') startRound(null, 'endless');
      else startRound(app.settings, 'normal');
    });
    $('play-again-btn').addEventListener('click', () => startRound(null, app.lastMode));
    $('adjust-btn').addEventListener('click', () => {
      app.setupMode = app.lastMode;
      applySetupModeUI();
      persist();
      showScreen('home');
    });
    $('suggestion-action').addEventListener('click', () => {
      if (app.suggestionConfig) startRound(app.suggestionConfig, app.suggestionMode);
    });

    document.querySelectorAll('#mode-group [data-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        app.setupMode = button.dataset.mode === 'endless' ? 'endless' : 'normal';
        applySetupModeUI();
        persist();
      });
    });

    document.querySelector('#mode-group').addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      const buttons = Array.from(document.querySelectorAll('#mode-group [data-mode]'));
      const current = buttons.indexOf(document.activeElement);
      if (current < 0) return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
      const next = buttons[(current + direction + buttons.length) % buttons.length];
      next.focus();
      next.click();
    });

    document.querySelectorAll('#theme-btn, #game-theme-btn').forEach((button) => {
      button.addEventListener('click', toggleTheme);
    });

    $('lang-btn').addEventListener('click', toggleLanguage);

    $('history-btn').addEventListener('click', openHistory);
    $('result-history-btn').addEventListener('click', openHistory);
    $('help-btn').addEventListener('click', openHelp);
    $('guide-help-btn').addEventListener('click', openHelp);

    $('brand-link').addEventListener('click', (event) => {
      event.preventDefault();
      if (app.screen === 'result') {
        app.setupMode = app.lastMode;
        applySetupModeUI();
        showScreen('home');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    $('quit-btn').addEventListener('click', openQuit);
    $('quit-cancel').addEventListener('click', () => {
      const dialog = $('quit-dialog');
      if (dialog.open) dialog.close();
    });
    $('quit-confirm').addEventListener('click', () => {
      if (app.game && app.game.mode === 'endless') {
        const dialog = $('quit-dialog');
        if (dialog.open) dialog.close();
        finishEndless();
      } else {
        quitCurrentGame();
      }
    });

    $('keypad').addEventListener('click', (event) => {
      const digitButton = event.target.closest('button[data-digit]');
      if (!digitButton) return;
      pressDigit(digitButton.dataset.digit);
      digitButton.blur();
    });
    $('backspace-btn').addEventListener('click', (event) => {
      backspace();
      event.currentTarget.blur();
    });
    $('submit-btn').addEventListener('click', (event) => {
      submitAnswer();
      event.currentTarget.blur();
    });
    $('memorize-btn').addEventListener('click', memorizeCurrent);
    $('continue-btn').addEventListener('click', continueAfterWrong);

    document.querySelectorAll('[data-close]').forEach((button) => {
      button.addEventListener('click', () => {
        const dialog = button.closest('dialog');
        if (dialog) dialog.close();
      });
    });

    document.querySelectorAll('dialog').forEach((dialog) => {
      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
      });
    });

    $('history-dialog').addEventListener('close', resetClearButton);
    $('clear-history').addEventListener('click', handleClearHistory);

    document.addEventListener('keydown', (event) => {
      if (document.querySelector('dialog[open]')) return;
      if (app.screen !== 'game' || !app.game || !app.game.startedAt) return;

      const focusedControl = event.target instanceof Element
        ? event.target.closest('button, a, input, textarea, select')
        : null;
      if (focusedControl && (event.key === 'Enter' || event.key === ' ')) return;

      const game = app.game;
      const phase = game.session.phase;

      if (phase === 'warmup') {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          memorizeCurrent();
        }
        return;
      }

      if (game.mode === 'endless') {
        if (phase === 'answer' && /^\d$/.test(event.key)) {
          event.preventDefault();
          submitEndlessDigit(event.key);
        }
        return;
      }

      if (phase === 'answer') {
        if (/^\d$/.test(event.key)) {
          event.preventDefault();
          pressDigit(event.key);
          return;
        }
        if (event.key === 'Backspace') {
          event.preventDefault();
          backspace();
          return;
        }
        if (event.key === 'Enter') {
          event.preventDefault();
          submitAnswer();
        }
        return;
      }

      if (phase === 'feedback' && game.correctionOpen) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          continueAfterWrong();
        }
      }
    });
  }

  applyTheme();
  applyLanguage();
  applySettingsUI();
  applySetupModeUI();
  showScreen('home', false);
  bindEvents();
})();
