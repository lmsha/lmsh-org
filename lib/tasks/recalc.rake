namespace :recalc do
  desc "Recalc counters and values"

  task counters: :environment do
    Category.values.each do |category_id|
      [7,8,9,10].each do |form|
        [1,2,3,4].each do |team|
          [1,0].each do |simple|
            value = Task.where(category_id: category_id, form: form,  simple: simple).where.not(id: Assignment.where(team: team).pluck(:task_id)).count(:all)
            TaskCounter.set(team, category_id, form, simple, value)
          end
        end
      end
    end
  end

  task values: :environment do
    TaskValue.clear_all
    Category.values.each do |category_id|
      TaskValue.dif_open(category_id).set Assignment.incomplete.joins(:task).where("tasks.category_id=? and tasks.simple=?",category_id,0).count(:all)
      TaskValue.dif_solved(category_id).set Assignment.complete.joins(:task).where("tasks.category_id=? and tasks.simple=?",category_id,0).count(:all)
      TaskValue.simple_open(category_id).set Assignment.incomplete.joins(:task).where("tasks.category_id=? and tasks.simple=?",category_id,1).count(:all)
      TaskValue.simple_solved(category_id).set Assignment.complete.joins(:task).where("tasks.category_id=? and tasks.simple=?",category_id,1).count(:all)
    end
  end

end
