# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

require 'faker'

def create_users(from_value = 0, to_value, password, role)
    puts "Creating users #{to_value - from_value} times (role - #{role})..."
    (to_value - from_value).times do |index|
        user = User.create(
            email: "#{role}#{index + from_value + 1}@advo.cate",
            password: password,
            name: Faker::Name.first_name,
            second_name: [true, false].sample ? Faker::Name.first_name : nil,
            surname: Faker::Name.last_name,
            role: role
        ) 
        puts user.save ? "+" : "-"
    end
end

def create_cases(count)
    puts "Creating cases #{count} times..."
    lawyers = User.all.where(role: "lawyer")
    count.times do |index|
        start_date = Faker::Date.between(from: Date.new(2020, 1, 1), to: Date.new(2024, 12, 31))
        end_date = Faker::Date.between(from: start_date + 1, to: Date.new(2025, 12, 31))

        kase = Case.new(
            title: Faker::Lorem.sentence(word_count: 3),
            description: Faker::Lorem.paragraph,
            client_name: "#{Faker::Name.first_name} #{Faker::Name.last_name}",
            court: Faker::Company.name + " Court",
            case_number: Faker::Number.unique.number(digits: 8).to_s,
            start_date: start_date,
            end_date: [true, false].sample ? end_date : nil,
            lawyer: lawyers.sample
        )
        puts kase.save ? "+" : "-"
    end
end

def main
    # For example
    # To create 30 secretaries with password "password"
    #   create_users(0, 30, "password", "secretary")
    # To create 10 cases to sample lawyers
    #   create_cases(10)
    
    puts "Done"
end

main
